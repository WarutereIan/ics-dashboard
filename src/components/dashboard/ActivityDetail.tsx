import React from 'react';
import { useParams } from 'react-router-dom';
import { Activity, Calendar, Users, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadialGauge } from '@/components/visualizations/RadialGauge';
import { AreaChart } from '@/components/visualizations/AreaChart';
import { 
  comprehensiveActivitiesData,
  generateProgressData,
  getStatusColor
} from '@/lib/mockData';

export function ActivityDetail() {
  const { activityId, outcomeId } = useParams();
  const activity = comprehensiveActivitiesData[activityId as keyof typeof comprehensiveActivitiesData];

  if (!activity) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Activity not found</h2>
          <p className="text-muted-foreground mt-2">Activity {activityId} could not be found.</p>
        </div>
      </div>
    );
  }

  // Generate progress data based on activity current value
  const progressData = generateProgressData(activity.current, activity.target);

  const progressPercentage = Math.round((activity.current / activity.target) * 100);
  const budgetUsed = Math.round((activity.spent / activity.budget) * 100);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Outcome {outcomeId}</span>
          <span>•</span>
          <span>Activity {activityId}</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Activity {activityId}: {activity.title}</h1>
        <p className="text-muted-foreground mt-2">{activity.description}</p>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Progress
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activity.current}</div>
            <p className="text-xs text-muted-foreground">
              of {activity.target} {activity.unit}
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Budget Utilization
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{budgetUsed}%</div>
            <p className="text-xs text-muted-foreground">
              ${activity.spent.toLocaleString()} used
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
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
              Sub-Activities
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activity.subActivities.length}</div>
            <p className="text-xs text-muted-foreground">total sub-activities</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Activity Progress</CardTitle>
            <CardDescription>Overall completion percentage</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <RadialGauge 
              value={progressPercentage} 
              size={180} 
              thickness={12}
              unit="%" 
              primaryColor="#14B8A6"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Monthly Progress Timeline</CardTitle>
            <CardDescription>Cumulative progress over time</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart 
              data={progressData} 
              height={250} 
              areaColor="#14B8A6"
              showCumulative={true}
            />
          </CardContent>
        </Card>
      </div>

      {/* Sub-Activities */}
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Sub-Activities</CardTitle>
          <CardDescription>Detailed breakdown of all sub-activities for this activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activity.subActivities.map((subActivity) => (
              <div key={subActivity.id} className="p-6 rounded-lg border border-border bg-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2">
                      {subActivity.id}: {subActivity.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">{subActivity.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Due: {new Date(subActivity.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(subActivity.status)}>
                    {subActivity.status.charAt(0).toUpperCase() + subActivity.status.slice(1).replace('-', ' ')}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Progress</span>
                    <span className="text-muted-foreground">{subActivity.progress}%</span>
                  </div>
                  <Progress value={subActivity.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Timeline & Budget</CardTitle>
            <CardDescription>Activity timeline and budget information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Start Date</div>
                <div className="text-lg font-semibold text-foreground">
                  {new Date(activity.startDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">End Date</div>
                <div className="text-lg font-semibold text-foreground">
                  {new Date(activity.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="text-sm font-medium text-muted-foreground mb-2">Budget Utilization</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Budget</span>
                  <span>${activity.budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Amount Spent</span>
                  <span>${activity.spent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Remaining</span>
                  <span>${(activity.budget - activity.spent).toLocaleString()}</span>
                </div>
                <Progress value={budgetUsed} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Key Details</CardTitle>
            <CardDescription>Important activity information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Responsible Team</div>
              <div className="text-lg font-semibold text-foreground">{activity.responsible}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Location</div>
              <div className="text-lg font-semibold text-foreground">{activity.location}</div>
            </div>
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {activity.subActivities.filter(sa => sa.status === 'completed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {activity.subActivities.filter(sa => sa.status === 'in-progress').length}
                  </div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 