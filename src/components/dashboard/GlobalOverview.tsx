import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadialGauge } from '@/components/visualizations/RadialGauge';
import { StackedBarChart } from '@/components/visualizations/StackedBarChart';
import { AreaChart } from '@/components/visualizations/AreaChart';
import { BulletChart } from '@/components/visualizations/BulletChart';
import { PieChart } from '@/components/visualizations/PieChart';
import { Progress } from '@/components/ui/progress';
import { Target, Activity, TrendingUp, ChevronRight } from 'lucide-react';
import { organizationalGoals } from '@/lib/organizationalGoals';

// Helper functions
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

const getOverallProgress = (subgoals: any[]) => {
  if (subgoals.length === 0) return 0;
  const totalProgress = subgoals.reduce((sum, subgoal) => {
    return sum + (subgoal.kpi.value / subgoal.kpi.target) * 100;
  }, 0);
  return Math.round(totalProgress / subgoals.length);
};

export function GlobalOverview() {
  // Calculate summary statistics
  const totalSubgoals = organizationalGoals.reduce((sum, goal) => sum + goal.subgoals.length, 0);
  const totalActivities = organizationalGoals.reduce((sum, goal) => 
    sum + goal.subgoals.reduce((subSum, subgoal) => subSum + subgoal.linkedActivities.length, 0), 0
  );
  const uniqueProjects = new Set();
  organizationalGoals.forEach(goal => {
    goal.subgoals.forEach(subgoal => {
      subgoal.linkedActivities.forEach(activity => {
        uniqueProjects.add(activity.projectId);
      });
    });
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Organization Strategic Goals</h1>
        <p className="text-muted-foreground">
          Strategic goals with linked project activities and key performance indicators
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Strategic Goals</p>
                <p className="text-3xl font-bold text-foreground">{organizationalGoals.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sub-Goals</p>
                <p className="text-3xl font-bold text-foreground">{totalSubgoals}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contributing Projects</p>
                <p className="text-3xl font-bold text-foreground">{uniqueProjects.size}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Activities</p>
                <p className="text-3xl font-bold text-foreground">{totalActivities}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Goals */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Strategic Goals</h2>
        
        {organizationalGoals.map((goal) => {
          const overallProgress = getOverallProgress(goal.subgoals);
          
          return (
            <Card key={goal.id} className="transition-all duration-200 hover:shadow-lg cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {goal.title}
                      </CardTitle>
                      <Badge className={getPriorityColor(goal.priority)}>
                        {goal.priority} priority
                      </Badge>
                    </div>
                    <CardDescription className="text-base">{goal.description}</CardDescription>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {goal.subgoals.length} sub-goals
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {goal.subgoals.reduce((sum, sg) => sum + sg.linkedActivities.length, 0)} activities
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Overall Progress: {overallProgress}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <Link to={`/dashboard/goals/${goal.id}`}>
                      <Button variant="outline" className="group-hover:bg-blue-50 group-hover:border-blue-200">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                    <div className="text-right">
                      <Progress value={overallProgress} className="w-32" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {goal.subgoals.map((subgoal) => (
                    <Card key={subgoal.id} className="bg-muted/50 hover:bg-muted/70 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base font-semibold leading-tight">
                            {subgoal.title}
                          </CardTitle>
                          <Link to={`/dashboard/goals/${goal.id}/subgoals/${subgoal.id}`}>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="w-3 h-3" />
                            </Button>
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Activity className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {subgoal.linkedActivities.length} contributing activities
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {subgoal.kpi.type === 'radialGauge' && (
                          <div className="flex justify-center">
                            <RadialGauge 
                              value={(subgoal.kpi.value / subgoal.kpi.target) * 100} 
                              size={100} 
                              unit={subgoal.kpi.unit} 
                              primaryColor="#3B82F6"
                              max={100}
                            />
                          </div>
                        )}
                        {subgoal.kpi.type === 'bulletChart' && (
                          <BulletChart
                            current={subgoal.kpi.value}
                            target={subgoal.kpi.target}
                            title={subgoal.title}
                            unit={subgoal.kpi.unit}
                            height={80}
                          />
                        )}
                        {subgoal.kpi.type === 'progressBar' && (
                          <div className="w-full">
                            <div className="mb-2 text-sm font-medium">
                              {subgoal.kpi.value.toLocaleString()} / {subgoal.kpi.target.toLocaleString()} {subgoal.kpi.unit}
                            </div>
                            <Progress value={(subgoal.kpi.value / subgoal.kpi.target) * 100} className="h-2" />
                            <div className="mt-1 text-xs text-muted-foreground">
                              {Math.round((subgoal.kpi.value / subgoal.kpi.target) * 100)}% Complete
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}