import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Target, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RadialGauge } from '@/components/visualizations/RadialGauge';
import { BulletChart } from '@/components/visualizations/BulletChart';
import { PieChart } from '@/components/visualizations/PieChart';
import { getGoalById, getSubGoalById, ActivityLink } from '@/lib/organizationalGoals';

export function GoalDetails() {
  const { goalId, subGoalId } = useParams();
  const [selectedSubGoal, setSelectedSubGoal] = useState<string | undefined>(subGoalId);

  // If we have a subGoalId, get the parent goal and specific subgoal
  const subGoalData = subGoalId ? getSubGoalById(subGoalId) : undefined;
  const goal = subGoalData ? subGoalData.goal : goalId ? getGoalById(goalId) : undefined;
  const specificSubGoal = subGoalData ? subGoalData.subGoal : undefined;

  if (!goal) {
    return (
      <div className="flex flex-col space-y-8 overflow-x-hidden w-full max-w-full px-2 md:px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Goal Not Found</h1>
          <p className="text-muted-foreground">The requested organizational goal could not be found.</p>
          <Link to="/dashboard">
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'contributing':
        return 'bg-green-100 text-green-800';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'not-contributing':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderKPIVisualization = (kpi: any) => {
    switch (kpi.type) {
      case 'radialGauge':
        return (
          <RadialGauge 
            value={(kpi.value / kpi.target) * 100} 
            size={150} 
            unit={kpi.unit} 
            primaryColor="#3B82F6"
            max={100}
          />
        );
      case 'bulletChart':
        return (
          <BulletChart
            current={kpi.value}
            target={kpi.target}
            title="Progress"
            unit={kpi.unit}
            height={100}
          />
        );
      case 'progressBar':
        return (
          <div className="w-full">
            <div className="mb-2 text-sm font-medium">
              {kpi.value.toLocaleString()} / {kpi.target.toLocaleString()} {kpi.unit}
            </div>
            <Progress value={(kpi.value / kpi.target) * 100} className="h-3" />
            <div className="mt-1 text-xs text-muted-foreground">
              {Math.round((kpi.value / kpi.target) * 100)}% Complete
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const ActivityConnectionCard = ({ activity }: { activity: ActivityLink }) => (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-foreground">{activity.activityTitle}</h4>
            <p className="text-xs text-muted-foreground">{activity.projectName}</p>
          </div>
          <Badge className={getStatusColor(activity.status)}>
            {activity.status.replace('-', ' ')}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-muted-foreground">Contribution</span>
            <span className="text-sm font-bold text-foreground">{activity.contribution}%</span>
          </div>
          <Progress value={activity.contribution} className="h-2" />
          
          <Link to={`/dashboard/projects/${activity.projectId}/activities`}>
            <Button variant="outline" size="sm" className="w-full mt-2">
              <Activity className="w-3 h-3 mr-1" />
              View in Project
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  // If viewing a specific subgoal
  if (specificSubGoal) {
    return (
      <div className="flex flex-col space-y-8 overflow-x-hidden w-full max-w-full px-2 md:px-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to={`/dashboard/goals/${goal.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Goal
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{specificSubGoal.title}</h1>
            <p className="text-muted-foreground">{specificSubGoal.description}</p>
          </div>
        </div>

        {/* KPI Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Key Performance Indicator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              {renderKPIVisualization(specificSubGoal.kpi)}
            </div>
          </CardContent>
        </Card>

        {/* Contributing Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Contributing Project Activities ({specificSubGoal.linkedActivities.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {specificSubGoal.linkedActivities.map((activity, index) => (
                <ActivityConnectionCard key={index} activity={activity} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generate project contribution data for pie chart
  const projectContributions = new Map<string, { name: string; value: number; activities: number }>();
  
  goal.subgoals.forEach(subGoal => {
    subGoal.linkedActivities.forEach(activity => {
      const existing = projectContributions.get(activity.projectId);
      if (existing) {
        existing.value += activity.contribution;
        existing.activities += 1;
      } else {
        projectContributions.set(activity.projectId, {
          name: activity.projectName,
          value: activity.contribution,
          activities: 1
        });
      }
    });
  });

  const pieChartData = Array.from(projectContributions.values()).map(project => ({
    name: project.name,
    value: Math.round(project.value / project.activities), // Average contribution
    activities: project.activities
  }));

  return (
    <div className="flex flex-col space-y-8 overflow-x-hidden w-full max-w-full px-2 md:px-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{goal.title}</h1>
            <Badge className={getPriorityColor(goal.priority)}>
              {goal.priority} priority
            </Badge>
          </div>
          <p className="text-muted-foreground">{goal.description}</p>
          <p className="text-sm text-muted-foreground mt-1">
            <strong>Target Outcome:</strong> {goal.targetOutcome}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sub-Goals</p>
                <p className="text-3xl font-bold text-foreground">{goal.subgoals.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contributing Projects</p>
                <p className="text-3xl font-bold text-foreground">{projectContributions.size}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Activities</p>
                <p className="text-3xl font-bold text-foreground">
                  {goal.subgoals.reduce((sum, sg) => sum + sg.linkedActivities.length, 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Contributions Visualization */}
      {pieChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Contributions to Goal</CardTitle>
            <p className="text-sm text-muted-foreground">
              Average contribution percentage by project across all sub-goals
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <PieChart 
                data={pieChartData}
                height={300}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sub-Goals */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Sub-Goals & Project Activities</h2>
        
        {goal.subgoals.map((subGoal, index) => (
          <Card key={subGoal.id} className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{subGoal.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{subGoal.description}</p>
                </div>
                <Link to={`/dashboard/goals/${goal.id}/subgoals/${subGoal.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* KPI Visualization */}
                <div className="flex justify-center items-center">
                  {renderKPIVisualization(subGoal.kpi)}
                </div>

                {/* Contributing Activities */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Contributing Activities ({subGoal.linkedActivities.length})
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {subGoal.linkedActivities.map((activity, actIndex) => (
                      <div 
                        key={actIndex}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.activityTitle}</p>
                          <p className="text-xs text-muted-foreground">{activity.projectName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(activity.status)} variant="secondary">
                            {activity.contribution}%
                          </Badge>
                          <Link to={`/dashboard/projects/${activity.projectId}/activities`}>
                            <Button variant="ghost" size="sm">
                              <Activity className="w-3 h-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}