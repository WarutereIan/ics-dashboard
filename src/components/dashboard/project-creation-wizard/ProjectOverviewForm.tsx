import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpTrayIcon, MapPinIcon, DocumentTextIcon, XMarkIcon, FlagIcon } from '@heroicons/react/24/outline';
import { Image } from 'lucide-react';

import { ProjectFormData, ProjectMapFormData, TheoryOfChangeFormData } from './types';

interface ProjectOverviewFormProps {
  projectData: ProjectFormData;
  onUpdate: (updates: Partial<ProjectFormData>) => void;
}

export function ProjectOverviewForm({ projectData, onUpdate }: ProjectOverviewFormProps) {
  const [mapData, setMapData] = useState<ProjectMapFormData>(
    projectData.mapData || {
      type: 'data-visualization',
      title: '',
      description: '',
      mapProvider: 'openstreetmap',
      visualizationType: 'markers',
      center: { lat: 0, lng: 0 },
      zoom: 10,
      dataSource: 'form-responses',
    }
  );

  const [theoryOfChange, setTheoryOfChange] = useState<TheoryOfChangeFormData>(
    projectData.theoryOfChange || {
      type: 'text',
      content: '',
      description: '',
    }
  );

  const handleMapDataUpdate = (updates: Partial<ProjectMapFormData>) => {
    const updatedMapData = { ...mapData, ...updates };
    setMapData(updatedMapData);
    onUpdate({ mapData: updatedMapData });
  };

  const handleTheoryOfChangeUpdate = (updates: Partial<TheoryOfChangeFormData>) => {
    const updatedTOC = { ...theoryOfChange, ...updates };
    setTheoryOfChange(updatedTOC);
    onUpdate({ theoryOfChange: updatedTOC });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload the file to a server
      // For now, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      handleTheoryOfChangeUpdate({
        type: 'image',
        content: imageUrl,
      });
    }
  };

  const removeImage = () => {
    handleTheoryOfChangeUpdate({
      type: 'text',
      content: '',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Project Overview</h2>
        <p className="text-muted-foreground">
          Add background information, map visualization, and theory of change for your project.
        </p>
      </div>

      {/* Background Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DocumentTextIcon className="h-5 w-5" />
            Background Information
          </CardTitle>
          <CardDescription>
            Provide detailed background information about the project context, challenges, and objectives.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="backgroundInformation">Background Information</Label>
              <Textarea
                id="backgroundInformation"
                placeholder="Describe the project background, context, challenges, and objectives..."
                value={projectData.backgroundInformation || ''}
                onChange={(e) => onUpdate({ backgroundInformation: e.target.value })}
                rows={8}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" />
            Map Visualization
          </CardTitle>
          <CardDescription>
            Configure map visualization to display project data from form responses with location information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mapTitle">Map Title</Label>
                <Input
                  id="mapTitle"
                  placeholder="Enter map title"
                  value={mapData?.title || ''}
                  onChange={(e) => handleMapDataUpdate({ title: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="mapProvider">Map Provider</Label>
                <Select
                  value={mapData?.mapProvider || 'openstreetmap'}
                  onValueChange={(value: 'openstreetmap' | 'google-maps') =>
                    handleMapDataUpdate({ mapProvider: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openstreetmap">OpenStreetMap</SelectItem>
                    <SelectItem value="google-maps">Google Maps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="mapDescription">Map Description</Label>
              <Textarea
                id="mapDescription"
                placeholder="Describe what the map shows and how to interpret it..."
                value={mapData?.description || ''}
                onChange={(e) => handleMapDataUpdate({ description: e.target.value })}
                rows={3}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="visualizationType">Visualization Type</Label>
              <Select
                value={mapData?.visualizationType || 'markers'}
                onValueChange={(value: 'markers' | 'heatmap' | 'choropleth') =>
                  handleMapDataUpdate({ visualizationType: value })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="markers">Markers</SelectItem>
                  <SelectItem value="heatmap">Heatmap</SelectItem>
                  <SelectItem value="choropleth">Choropleth</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="centerLat">Center Latitude</Label>
                <Input
                  id="centerLat"
                  type="number"
                  step="any"
                  placeholder="0.0"
                  value={mapData?.center?.lat || 0}
                  onChange={(e) =>
                    handleMapDataUpdate({
                      center: { lat: parseFloat(e.target.value) || 0, lng: mapData.center?.lng || 0 }
                    })
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="centerLng">Center Longitude</Label>
                <Input
                  id="centerLng"
                  type="number"
                  step="any"
                  placeholder="0.0"
                  value={mapData?.center?.lng || 0}
                  onChange={(e) =>
                    handleMapDataUpdate({
                      center: { lat: mapData.center?.lat || 0, lng: parseFloat(e.target.value) || 0 }
                    })
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="zoom">Zoom Level</Label>
                <Input
                  id="zoom"
                  type="number"
                  min="1"
                  max="20"
                  placeholder="10"
                  value={mapData?.zoom || 10}
                  onChange={(e) =>
                    handleMapDataUpdate({ zoom: parseInt(e.target.value) || 10 })
                  }
                  className="mt-2"
                />
              </div>
            </div>

            <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                Map will display data from form responses containing location information.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Data will be automatically populated from location questions in your forms.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theory of Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlagIcon className="h-5 w-5" />
            Theory of Change (TOC)
          </CardTitle>
          <CardDescription>
            Upload an image or provide text describing the project's theory of change.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={theoryOfChange?.type || 'text'} onValueChange={(value) => handleTheoryOfChangeUpdate({ type: value as 'image' | 'text' })}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="image">Image</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div>
                <Label htmlFor="tocText">Theory of Change Description</Label>
                <Textarea
                  id="tocText"
                  placeholder="Describe the project's theory of change, including inputs, activities, outputs, outcomes, and impact..."
                  value={theoryOfChange?.type === 'text' ? theoryOfChange.content : ''}
                  onChange={(e) => handleTheoryOfChangeUpdate({ content: e.target.value })}
                  rows={8}
                  className="mt-2"
                />
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              {theoryOfChange?.type === 'image' && theoryOfChange.content ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={theoryOfChange.content}
                      alt="Theory of Change"
                      className="w-full max-w-md mx-auto border border-gray-300 rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="absolute top-2 right-2"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label htmlFor="tocImageDescription">Image Description</Label>
                    <Textarea
                      id="tocImageDescription"
                      placeholder="Describe the theory of change image..."
                      value={theoryOfChange.description || ''}
                      onChange={(e) => handleTheoryOfChangeUpdate({ description: e.target.value })}
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <Label htmlFor="tocImageUpload" className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span>Upload Theory of Change Image</span>
                    </Button>
                  </Label>
                  <input
                    id="tocImageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload an image file (PNG, JPG, GIF) showing the theory of change
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
