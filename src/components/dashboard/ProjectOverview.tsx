import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Target, AlertTriangle, FileText, MapPin, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadialGauge } from '@/components/visualizations/RadialGauge';
import { BulletChart } from '@/components/visualizations/BulletChart';
import { StackedBarChart } from '@/components/visualizations/StackedBarChart';
import { useDashboard } from '@/contexts/DashboardContext';
import { getProjectOutcomes, getProjectActivities, getProjectSubActivities } from '@/lib/icsData';
import { format } from 'date-fns';
import { ProjectMapVisualization } from './ProjectMapVisualization';

export function ProjectOverview() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user, projects } = useDashboard();

  if (!user) return null;
  if (!projectId) {
    return <div>No project selected</div>;
  }

  // Get project details for title and other info
  const currentProject = projects.find(p => p.id === projectId);
  const projectName = currentProject?.name || projectId.toUpperCase();

  // Get project data for stats
  const outcomes = user ? getProjectOutcomes(user, projectId) : [];
  const activities = user ? getProjectActivities(user, projectId) : [];
  const subactivities = user ? getProjectSubActivities(user, projectId) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'behind':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
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
          <Target className="h-4 w-4" />
          KPI Analytics
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/dashboard/projects/${projectId}/forms`)}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Forms
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/dashboard/projects/${projectId}/media`)}
          className="flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
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
              <Edit className="h-4 w-4" />
              Edit Overview
            </Button>
          </div>

          {/* Background Information */}
          {currentProject.backgroundInformation && (
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
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
                  <Target className="h-5 w-5 text-purple-600" />
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
              <CardTitle className="text-lg text-blue-900">Project Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{outcomes.length}</div>
                  <div className="text-sm text-blue-700">Outcomes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{activities.length}</div>
                  <div className="text-sm text-green-700">Activities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{subactivities.length}</div>
                  <div className="text-sm text-purple-700">Sub-activities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{currentProject.progress}%</div>
                  <div className="text-sm text-orange-700">Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* No Overview Data Message */}
          {!currentProject.backgroundInformation && !currentProject.mapData && !currentProject.theoryOfChange && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                {currentProject?.status?.charAt(0).toUpperCase() + currentProject?.status?.slice(1) || 'Active'}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">Project Status</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}