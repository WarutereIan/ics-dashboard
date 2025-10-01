import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarIcon, CurrencyDollarIcon, FlagIcon, ExclamationTriangleIcon, DocumentTextIcon, MapPinIcon, PencilIcon } from '@heroicons/react/24/outline';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadialGauge } from '@/components/visualizations/RadialGauge';
import { BulletChart } from '@/components/visualizations/BulletChart';
import { StackedBarChart } from '@/components/visualizations/StackedBarChart';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/contexts/ProjectsContext';
import { format } from 'date-fns';
import { ProjectMapVisualization } from './ProjectMapVisualization';
import { Outcome, Activity } from '@/types/dashboard';

export function ProjectOverview() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    projects, 
    getProjectById,
    getProjectOutcomes, 
    getProjectActivities, 
    getProjectSubActivities,
    dataRefreshTrigger
  } = useProjects();

  if (!user) return null;
  if (!projectId) {
    return <div>No project selected</div>;
  }

  // Get project details for title and other info
  const currentProject = getProjectById(projectId);
  const projectName = currentProject?.name || projectId.toUpperCase();

  // Get project data for stats (these are now async functions, we'll need to handle them differently)
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [subactivities, setSubactivities] = useState<any[]>([]);

  // Load project data
  useEffect(() => {
    const loadProjectData = async () => {
      if (projectId && user) {
        try {
          console.log(`🔄 ProjectOverview: Loading data for project ${projectId} (refresh trigger: ${dataRefreshTrigger})`);
          const [outcomesData, activitiesData, subactivitiesData] = await Promise.all([
            getProjectOutcomes(projectId),
            getProjectActivities(projectId),
            getProjectSubActivities(projectId)
          ]);
          setOutcomes(outcomesData);
          setActivities(activitiesData);
          setSubactivities(subactivitiesData);
          console.log(`✅ ProjectOverview: Loaded ${outcomesData.length} outcomes, ${activitiesData.length} activities, ${subactivitiesData.length} subactivities`);
        } catch (error) {
          console.error('Error loading project data:', error);
        }
      }
    };

    loadProjectData();
  }, [projectId, user, getProjectOutcomes, getProjectActivities, getProjectSubActivities, dataRefreshTrigger]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ON_TRACK':
        return 'bg-green-100 text-green-800';
      case 'AT_RISK':
        return 'bg-yellow-100 text-yellow-800';
      case 'BEHIND':
        return 'bg-emerald-100 text-emerald-800';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{projectName}</h1>
        <p className="text-muted-foreground">{currentProject?.description || 'Project overview and details'}</p>
      </div>

      {/* Project Navigation Links */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/dashboard/projects/${projectId}/kpi`)}
          className="flex items-center gap-2"
        >
          <FlagIcon className="h-4 w-4" />
          KPI Analytics
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/dashboard/projects/${projectId}/forms`)}
          className="flex items-center gap-2"
        >
          <DocumentTextIcon className="h-4 w-4" />
          Forms
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/dashboard/projects/${projectId}/financial`)}
          className="flex items-center gap-2"
        >
          <CurrencyDollarIcon className="h-4 w-4" />
          Financial
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/dashboard/projects/${projectId}/media`)}
          className="flex items-center gap-2"
        >
          <MapPinIcon className="h-4 w-4" />
          Media
        </Button>
      </div>

      {/* Project Overview Information - Main Content */}
      {currentProject && (
        <div className="space-y-6">
          {/* Project Overview Header */}
          <div className="border-b pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Project Overview</h2>
              <p className="text-sm text-gray-600 mt-1">
                Comprehensive project information including background, map visualization, and theory of change
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/dashboard/projects/${projectId}/edit`)}
              className="flex items-center gap-2"
            >
              <PencilIcon className="h-4 w-4" />
              Edit Overview
            </Button>
          </div>

          {/* Background Information */}
          {currentProject.backgroundInformation && (
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5 text-emerald-600" />
                  Background Information
                </CardTitle>
                <CardDescription>
                  Project context, challenges, and objectives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm leading-relaxed text-gray-700">{currentProject.backgroundInformation}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Map Visualization */}
          {currentProject.mapData && (
            <ProjectMapVisualization 
              project={currentProject}
              mapData={currentProject.mapData}
            />
          )}

          {/* Theory of Change */}
          {currentProject.theoryOfChange && (
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlagIcon className="h-5 w-5 text-emerald-600" />
                  Theory of Change
                  {currentProject.theoryOfChange.lastUpdated && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Updated {format(currentProject.theoryOfChange.lastUpdated, 'MMM dd, yyyy')}
                    </Badge>
                  )}
                </CardTitle>
                {currentProject.theoryOfChange.description && (
                  <CardDescription>{currentProject.theoryOfChange.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {currentProject.theoryOfChange.type === 'image' ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <img 
                        src={currentProject.theoryOfChange.content} 
                        alt="Theory of Change" 
                        className="w-full max-w-2xl border rounded-lg shadow-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap font-sans">
                        {currentProject.theoryOfChange.content}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Project Quick Stats */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-900">Project Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{outcomes.length}</div>
                  <div className="text-sm text-emerald-700">Outcomes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{activities.length}</div>
                  <div className="text-sm text-green-700">Activities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{subactivities.length}</div>
                  <div className="text-sm text-emerald-700">Sub-activities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-lime-600">{currentProject.progress}%</div>
                  <div className="text-sm text-lime-700">Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* No Overview Data Message */}
          {!currentProject.backgroundInformation && !currentProject.mapData && !currentProject.theoryOfChange && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Overview Information</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This project doesn't have background information, map visualization, or theory of change configured yet.
                </p>
                <p className="text-xs text-gray-500">
                  Project overview information can be added when editing the project.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Project Duration and Status Summary */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{currentProject?.progress || 0}%</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
              <Progress value={currentProject?.progress || 0} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {currentProject?.startDate && currentProject?.endDate 
                  ? `${format(currentProject.startDate, 'MMM yyyy')} - ${format(currentProject.endDate, 'MMM yyyy')}`
                  : 'Dates not available'
                }
              </div>
              <div className="text-sm text-gray-600">Project Duration</div>
            </div>
            <div className="text-center">
              <Badge className={getStatusColor(currentProject?.status || 'active')}>
                {(currentProject?.status?.charAt(0)?.toUpperCase() || 'A') + (currentProject?.status?.slice(1) || 'ctive')}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">Project Status</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}