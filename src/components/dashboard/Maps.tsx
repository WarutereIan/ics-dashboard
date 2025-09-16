import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectMapVisualization } from './ProjectMapVisualization';
import { useProjects } from '@/contexts/ProjectsContext';
import { ProjectMapData } from '@/types/dashboard';

export function Maps() {
  const { projectId } = useParams();
  const { getProjectById } = useProjects();

  // Get the current project
  const project = projectId ? getProjectById(projectId) : null;

  // Create default map data if project doesn't have map data
  const mapData: ProjectMapData = project?.mapData || {
    type: 'data-visualization',
    title: project?.name ? `${project.name} - Data Map` : 'Project Data Map',
    description: 'Visualization of project data from form responses with location information',
    mapProvider: 'openstreetmap',
    visualizationType: 'markers',
    center: { lat: -1.2921, lng: 36.8219 }, // Default to Nairobi
    zoom: 10,
    dataSource: 'form-responses'
  };

  if (!project) {
    return (
      <div className="flex flex-col space-y-6 w-full min-w-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 w-full min-w-0">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-foreground break-words">Maps</h1>
            <p className="text-muted-foreground break-words">Visualize project locations and biodata</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Project Not Found</h3>
            <p className="text-sm text-muted-foreground">
              The requested project could not be found or you don't have access to it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 w-full min-w-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 w-full min-w-0">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-foreground break-words">Maps</h1>
          <p className="text-muted-foreground break-words">Visualize project locations and biodata</p>
        </div>
      </div>

      {/* Use ProjectMapVisualization component */}
      <ProjectMapVisualization project={project} mapData={mapData} />
    </div>
  );
} 