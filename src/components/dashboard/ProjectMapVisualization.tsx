import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Users, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngTuple } from 'leaflet';
// Fix default marker icon issue in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Project, ProjectMapData } from '@/types/dashboard';
import { FormResponse, Form } from '@/components/dashboard/form-creation-wizard/types';
import { useForm } from '@/contexts/FormContext';
import { useProjects } from '@/contexts/ProjectsContext';
import { addSampleFormResponsesToStorage, hasSampleFormResponses } from '@/lib/sampleFormResponses';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LocationDataPoint {
  id: string;
  formId: string;
  formTitle: string;
  questionId: string;
  questionTitle: string;
  coordinates: { lat: number; lng: number };
  accuracy?: number;
  address?: string;
  submittedAt: Date;
  responseData: Record<string, any>;
  respondentId?: string;
}

interface ProjectMapVisualizationProps {
  project: Project;
  mapData: ProjectMapData;
}

export function ProjectMapVisualization({ project, mapData }: ProjectMapVisualizationProps) {
  const { projectId } = useParams();
  const { getFormResponses, getProjectForms } = useForm();
  const { projects } = useProjects();

  // Debug render frequency
  const renderCount = React.useRef(0);
  renderCount.current += 1;
  console.log('🗺️ ProjectMapVisualization render #', renderCount.current, 'for project:', projectId);
  
  const [locationData, setLocationData] = useState<LocationDataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<LocationDataPoint[]>([]);
  const [selectedForm, setSelectedForm] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSampleData, setHasSampleData] = useState(false);
  const [projectForms, setProjectForms] = useState<Form[]>([]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Get all forms for this project and extract location data
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const loadLocationData = async () => {
      if (!projectId) return;

      console.log('🗺️ Loading map location data for project:', projectId, 'trigger:', refreshTrigger);
      
      // Set loading state and clear previous data
      setIsLoading(true);
      setLocationData([]);
      setFilteredData([]);
      
      // Set a timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        console.log('🗺️ Loading timeout - forcing completion');
        setIsLoading(false);
      }, 30000); // 30 second timeout
      
      const allLocationData: LocationDataPoint[] = [];

      try {
        // Get project forms
        const forms = await getProjectForms(projectId);
        setProjectForms(forms);
        console.log('🗺️ Found forms:', forms.length);

        // Process each form in the project
        for (const form of forms) {
          try {
            const responsesResult = await getFormResponses(projectId, form.id);
            const responses = responsesResult.responses || [];
            console.log(`🗺️ Processing ${responses.length} responses for form:`, form.title);
            
              responses.forEach((response: FormResponse) => {
                // Look for location questions in the response data
                Object.entries(response.data).forEach(([questionId, value]) => {
                  // Check if this is a location response
                  if (value && typeof value === 'object' && 'latitude' in value && 'longitude' in value) {
                    const locationValue = value as { latitude: number; longitude: number; accuracy?: number; address?: string };
                    
                    allLocationData.push({
                      id: `${response.id}-${questionId}`,
                      formId: form.id,
                      formTitle: form.title,
                      questionId,
                      questionTitle: form.sections
                        ?.flatMap(s => s.questions)
                        ?.find(q => q.id === questionId)?.title || 'Location',
                      coordinates: {
                        lat: locationValue.latitude,
                        lng: locationValue.longitude
                      },
                      accuracy: locationValue.accuracy,
                      address: locationValue.address,
                      submittedAt: (() => {
                        const dateValue = response.submittedAt || response.startedAt;
                        const date = new Date(dateValue);
                        // Fallback to current date if invalid
                        return isNaN(date.getTime()) ? new Date() : date;
                      })(),
                      responseData: response.data,
                      respondentId: response.respondentId
                    });
                  }
                });
              });
            } catch (error) {
              console.error(`Error loading responses for form ${form.id}:`, error);
            }
          }

          console.log('🗺️ Total location data points found:', allLocationData.length);
          setLocationData(allLocationData);
          
          // Check if sample data exists
          if (projectId) {
            setHasSampleData(hasSampleFormResponses(projectId));
          }
        } catch (error) {
          console.error('Error loading location data:', error);
        } finally {
          console.log('🗺️ Loading completed, setting isLoading to false');
          clearTimeout(timeoutId);
          setIsLoading(false);
        }
      };

      loadLocationData();
      
      // Cleanup function
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }, [projectId, refreshTrigger]); // Depend on projectId and refresh trigger

  // Manual refresh function
  const refreshMapData = useCallback(() => {
    console.log('🗺️ Manual refresh triggered');
    setRefreshTrigger(prev => prev + 1);
  }, []);

    // Filter data based on selected criteria with memoization
  const filteredLocationData = useMemo(() => {
    console.log('🗺️ Filtering location data...');
    let filtered = locationData;
    
    // Filter by form
    if (selectedForm !== 'all') {
      filtered = filtered.filter(point => point.formId === selectedForm);
    }
    
    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(point => point.submittedAt >= cutoffDate);
    }

    return filtered;
  }, [locationData, selectedForm, dateRange]);

  // Update filtered data when memoized value changes
  useEffect(() => {
    setFilteredData(filteredLocationData);
  }, [filteredLocationData]);

  // Calculate map center and bounds
  const mapCenter = useMemo(() => {
    if (filteredData.length === 0) {
      return mapData.center || { lat: -1.2921, lng: 36.8219 }; // Default to Nairobi
    }

    const avgLat = filteredData.reduce((sum, point) => sum + point.coordinates.lat, 0) / filteredData.length;
    const avgLng = filteredData.reduce((sum, point) => sum + point.coordinates.lng, 0) / filteredData.length;
    
    return { lat: avgLat, lng: avgLng };
  }, [filteredData, mapData.center]);

  const getMarkerColor = (visualizationType: string, index: number) => {
    switch (visualizationType) {
      case 'markers':
        return '#3b82f6'; // Blue
      case 'heatmap':
        return '#ef4444'; // Red
      case 'choropleth':
        return '#10b981'; // Green
      default:
        return '#6b7280'; // Gray
    }
  };

  const getTileLayerUrl = (provider: string) => {
    switch (provider) {
      case 'google-maps':
        // Note: Google Maps requires API key in production
        return 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      case 'openstreetmap':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const getTileLayerAttribution = (provider: string) => {
    switch (provider) {
      case 'google-maps':
        return '© Google Maps';
      case 'openstreetmap':
      default:
        return '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
  };

  const handleAddSampleData = () => {
    if (projectId) {
      addSampleFormResponsesToStorage(projectId);
      setHasSampleData(true);
      // Reload the component to show new data
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading map data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <Select value={selectedForm} onValueChange={setSelectedForm}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Forms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Forms</SelectItem>
            {projectForms.map(form => (
              <SelectItem key={form.id} value={form.id}>
                {form.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="quarter">Last 3 Months</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          onClick={refreshMapData}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Data Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Forms with Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(filteredData.map(point => point.formId)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Latest Submission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {filteredData.length > 0 
                ? (() => {
                    try {
                      const validDates = filteredData
                        .map(p => {
                          const date = p.submittedAt instanceof Date ? p.submittedAt : new Date(p.submittedAt);
                          return isNaN(date.getTime()) ? null : date.getTime();
                        })
                        .filter(time => time !== null);
                      
                      return validDates.length > 0 
                        ? new Date(Math.max(...validDates)).toLocaleDateString()
                        : 'Invalid dates';
                    } catch (error) {
                      console.error('Error calculating latest submission:', error);
                      return 'Error';
                    }
                  })()
                : 'No data'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {mapData.title || 'Project Data Map'}
          </CardTitle>
          <CardDescription>
            {mapData.description || 'Visualization of project data from form responses with location information'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[400px] sm:h-[500px] rounded-lg overflow-hidden">
            <MapContainer
              center={[mapCenter.lat, mapCenter.lng] as LatLngTuple}
              zoom={mapData.zoom || 10}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution={getTileLayerAttribution(mapData.mapProvider)}
                url={getTileLayerUrl(mapData.mapProvider)}
              />
              
              {filteredData.map((point, index) => {
                const color = getMarkerColor(mapData.visualizationType, index);
                
                if (mapData.visualizationType === 'heatmap') {
                  // Use CircleMarker for heatmap effect
                  return (
                    <CircleMarker
                      key={point.id}
                      center={[point.coordinates.lat, point.coordinates.lng] as LatLngTuple}
                      radius={8}
                      fillColor={color}
                      color={color}
                      weight={2}
                      opacity={0.7}
                      fillOpacity={0.4}
                    >
                      <Popup>
                        <div className="max-w-[250px]">
                          <h3 className="font-semibold text-sm mb-2">{point.formTitle}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{point.questionTitle}</p>
                          <div className="space-y-1 text-xs">
                            <p><strong>Submitted:</strong> {(point.submittedAt instanceof Date ? point.submittedAt : new Date(point.submittedAt)).toLocaleDateString()}</p>
                            <p><strong>Coordinates:</strong> {point.coordinates.lat.toFixed(4)}, {point.coordinates.lng.toFixed(4)}</p>
                            {point.accuracy && <p><strong>Accuracy:</strong> ±{point.accuracy}m</p>}
                            {point.address && <p><strong>Address:</strong> {point.address}</p>}
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                } else {
                  // Use regular Marker for other visualization types
                  return (
                    <Marker
                      key={point.id}
                      position={[point.coordinates.lat, point.coordinates.lng] as LatLngTuple}
                    >
                      <Popup>
                        <div className="max-w-[250px]">
                          <h3 className="font-semibold text-sm mb-2">{point.formTitle}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{point.questionTitle}</p>
                          <div className="space-y-1 text-xs">
                            <p><strong>Submitted:</strong> {(point.submittedAt instanceof Date ? point.submittedAt : new Date(point.submittedAt)).toLocaleDateString()}</p>
                            <p><strong>Coordinates:</strong> {point.coordinates.lat.toFixed(4)}, {point.coordinates.lng.toFixed(4)}</p>
                            {point.accuracy && <p><strong>Accuracy:</strong> ±{point.accuracy}m</p>}
                            {point.address && <p><strong>Address:</strong> {point.address}</p>}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                }
              })}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* No Data Message */}
      {filteredData.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Location Data Available</h3>
            <p className="text-sm text-muted-foreground mb-4">
              No form responses with location data found for the selected filters.
            </p>
            <div className="text-xs text-muted-foreground mb-4">
              <p>To see data on this map:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Add location questions to your forms</li>
                <li>Collect responses with location data</li>
                <li>Try adjusting the filters above</li>
              </ul>
            </div>
            {!hasSampleData && (
              <Button 
                onClick={handleAddSampleData}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Add Sample Data for Testing
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
