import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BoltIcon, CalendarIcon, UsersIcon, CheckCircleIcon, ClockIcon, MapPinIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/contexts/ProjectsContext';
import { Activity as ActivityType } from '@/types/dashboard';

export function ActivityDetail() {
  const { activityId, projectId } = useParams();
  const navigate = useNavigate();
  const { getProjectActivities } = useProjects();
  const [activity, setActivity] = useState<ActivityType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActivityData();
  }, [activityId, projectId]);

  const loadActivityData = async () => {
    if (!projectId || !activityId) return;
    
    setIsLoading(true);
    try {
      const activities = await getProjectActivities(projectId);
      const foundActivity = activities.find(a => a.id === activityId);
      setActivity(foundActivity || null);
    } catch (error) {
      console.error('Error loading activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'IN_PROGRESS':
        return 'bg-emerald-100 text-emerald-800 border-blue-300';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'NOT_STARTED':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading activity details...</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Activity not found</h2>
          <p className="text-muted-foreground mt-2">Activity {activityId} could not be found.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mt-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Activities
        </Button>
        
        <h1 className="text-3xl font-bold text-foreground">{activity.title}</h1>
        <p className="text-muted-foreground mt-2">{activity.description}</p>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progress
            </CardTitle>
            <BoltIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activity.progress}%</div>
            <Progress value={activity.progress} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(activity.status)}>
              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1).replace('-', ' ')}
            </Badge>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Start Date
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-foreground">
              {formatDate(activity.startDate)}
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              End Date
            </CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-foreground">
              {formatDate(activity.endDate)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              Responsibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{activity.responsible}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5" />
              Activity ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground font-mono">{activity.id}</p>
          </CardContent>
        </Card>
      </div>

      {/* Sub-Activities */}
      {activity.subActivities && activity.subActivities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sub-Activities</CardTitle>
            <CardDescription>
              Detailed breakdown of this activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activity.subActivities.map((subActivity) => (
                <div 
                  key={subActivity.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{subActivity.title}</h4>
                    {subActivity.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {subActivity.description}
                      </p>
                    )}
                    {subActivity.dueDate && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Due: {formatDate(new Date(subActivity.dueDate))}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{subActivity.progress}%</div>
                      <Progress value={subActivity.progress} className="w-20" />
                    </div>
                    <Badge className={getStatusColor(subActivity.status)}>
                      {subActivity.status.charAt(0).toUpperCase() + subActivity.status.slice(1).replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Future Features Placeholder */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-muted-foreground">Enhanced Features Coming Soon</CardTitle>
          <CardDescription>
            The following features will be available once the backend APIs are implemented:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Budget tracking and financial data visualization</li>
            <li>• Progress charts and trend analysis</li>
            <li>• Activity timeline and milestone tracking</li>
            <li>• Resource allocation and dependency mapping</li>
            <li>• Real-time collaboration and comments</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}