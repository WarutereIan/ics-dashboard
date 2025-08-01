import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Map, MapPin, Users, School, Home, BarChart3, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngTuple } from 'leaflet';
// Fix default marker icon issue in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LocationData {
  id: string;
  name: string;
  type: 'school' | 'community' | 'health_center' | 'other';
  coordinates: { lat: number; lng: number };
  beneficiaries: number;
  activities: string[];
  status: 'active' | 'completed' | 'planned';
  lastUpdate: string;
}

// Mock location data
const mockLocations: LocationData[] = [
  {
    id: '1',
    name: 'Kibera Primary School',
    type: 'school',
    coordinates: { lat: -1.3129, lng: 36.7870 },
    beneficiaries: 245,
    activities: ['Child Rights Clubs', 'Mentorship Program', 'Life Skills Training'],
    status: 'active',
    lastUpdate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Mathare Community Center',
    type: 'community',
    coordinates: { lat: -1.2625, lng: 36.8607 },
    beneficiaries: 89,
    activities: ['Parent Training', 'Community Awareness'],
    status: 'active',
    lastUpdate: '2024-01-10'
  },
  {
    id: '3',
    name: 'Korogocho Health Center',
    type: 'health_center',
    coordinates: { lat: -1.2394, lng: 36.8956 },
    beneficiaries: 156,
    activities: ['Health Education', 'Nutrition Programs'],
    status: 'completed',
    lastUpdate: '2024-01-08'
  },
  {
    id: '4',
    name: 'Mukuru Secondary School',
    type: 'school',
    coordinates: { lat: -1.3175, lng: 36.8901 },
    beneficiaries: 198,
    activities: ['Child Rights Clubs', 'Reporting Mechanisms'],
    status: 'planned',
    lastUpdate: '2024-01-12'
  }
];

export function Maps() {
  const { projectId } = useParams();
  const [locations, setLocations] = useState<LocationData[]>(mockLocations);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'school':
        return <School className="h-4 w-4 text-blue-500" />;
      case 'community':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'health_center':
        return <Home className="h-4 w-4 text-red-500" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      planned: 'bg-yellow-100 text-yellow-800'
    };
    return variants[status as keyof typeof variants] || variants.planned;
  };

  const filteredLocations = locations.filter(location => {
    const typeMatch = selectedType === 'all' || location.type === selectedType;
    const statusMatch = selectedStatus === 'all' || location.status === selectedStatus;
    return typeMatch && statusMatch;
  });

  const totalBeneficiaries = filteredLocations.reduce((sum, loc) => sum + loc.beneficiaries, 0);

  return (
    <div className="flex flex-col space-y-6 w-full min-w-0 px-2 md:px-6 lg:px-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 w-full min-w-0">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-foreground break-words">Maps</h1>
          <p className="text-muted-foreground break-words">Visualize project locations and biodata</p>
        </div>
       
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full min-w-0">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLocations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Beneficiaries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBeneficiaries.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredLocations.filter(loc => loc.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Schools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredLocations.filter(loc => loc.type === 'school').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="school">Schools</SelectItem>
            <SelectItem value="community">Community Centers</SelectItem>
            <SelectItem value="health_center">Health Centers</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="list" className="w-full min-w-0">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <div className="grid gap-4">
            {filteredLocations.map((location) => (
              <Card key={location.id} className="transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getLocationIcon(location.type)}
                      <div>
                        <CardTitle className="text-lg">{location.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {location.type.replace('_', ' ').toUpperCase()} • {location.beneficiaries} beneficiaries
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusBadge(location.status)}>
                      {location.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Activities</h4>
                      <div className="flex flex-wrap gap-2">
                        {location.activities.map((activity, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm text-muted-foreground">
                      <span className="break-words">
                        Coordinates: {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                      </span>
                      <span className="break-words">
                        Last updated: {new Date(location.lastUpdate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                        <MapPin className="h-4 w-4" />
                        View on Map
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                        <BarChart3 className="h-4 w-4" />
                        View Data
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="map" className="space-y-4 w-full min-w-0">
          <Card className="w-full min-w-0">
            <CardContent className="p-0 w-full min-w-0">
              <div className="w-full min-w-0 h-[350px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden">
                <MapContainer
                  center={filteredLocations.length > 0
                    ? [
                        filteredLocations.reduce((sum, l) => sum + l.coordinates.lat, 0) / filteredLocations.length,
                        filteredLocations.reduce((sum, l) => sum + l.coordinates.lng, 0) / filteredLocations.length
                      ] as LatLngTuple
                    : ([ -1.286389, 36.817223 ] as LatLngTuple)
                  }
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                  className="w-full min-w-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredLocations.map(location => (
                    <Marker
                      key={location.id}
                      position={[location.coordinates.lat, location.coordinates.lng] as LatLngTuple}
                    >
                      <Popup>
                        <div className="break-words max-w-[200px]">
                          <strong>{location.name}</strong>
                          <div className="text-xs text-muted-foreground mb-1 break-words">
                            {location.type.replace('_', ' ').toUpperCase()}<br/>
                            Beneficiaries: {location.beneficiaries}
                          </div>
                          <div className="mb-1">
                            <span className="font-medium">Activities:</span>
                            <ul className="list-disc ml-4">
                              {location.activities.map((activity, idx) => (
                                <li key={idx} className="text-xs break-words">{activity}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="text-xs text-muted-foreground">Last updated: {new Date(location.lastUpdate).toLocaleDateString()}</div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['school', 'community', 'health_center', 'other'].map((type) => {
                    const count = filteredLocations.filter(loc => loc.type === type).length;
                    const percentage = filteredLocations.length > 0 ? (count / filteredLocations.length) * 100 : 0;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm capitalize flex-shrink-0">{type.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2 min-w-0 flex-1 ml-4">
                          <div className="w-full max-w-[80px] bg-gray-200 rounded-full h-2 flex-1">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium flex-shrink-0">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['active', 'completed', 'planned'].map((status) => {
                    const count = filteredLocations.filter(loc => loc.status === status).length;
                    const percentage = filteredLocations.length > 0 ? (count / filteredLocations.length) * 100 : 0;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm capitalize flex-shrink-0">{status}</span>
                        <div className="flex items-center gap-2 min-w-0 flex-1 ml-4">
                          <div className="w-full max-w-[80px] bg-gray-200 rounded-full h-2 flex-1">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium flex-shrink-0">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 