import React from 'react';
import { useParams } from 'react-router-dom';
import { Target, TrendingUp, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadialGauge } from '@/components/visualizations/RadialGauge';
import { AreaChart } from '@/components/visualizations/AreaChart';
import { PieChart } from '@/components/visualizations/PieChart';
import { 
  comprehensiveOutcomesData, 
  comprehensiveOutputsData, 
  comprehensiveActivitiesData,
  generateProgressData,
  getStatusColor
} from '@/lib/mockData';

export function OutcomeDetail() {
  const { outcomeId } = useParams();
  const outcome = comprehensiveOutcomesData[outcomeId as keyof typeof comprehensiveOutcomesData];

  if (!outcome) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Outcome not found</h2>
          <p className="text-muted-foreground mt-2">Outcome {outcomeId} could not be found.</p>
        </div>
      </div>
    );
  }

  // Get related outputs and activities
  const relatedOutputs = outcome.outputs.map(outputId => comprehensiveOutputsData[outputId as keyof typeof comprehensiveOutputsData]).filter(Boolean);
  const relatedActivities = outcome.activities.map(activityId => comprehensiveActivitiesData[activityId as keyof typeof comprehensiveActivitiesData]).filter(Boolean);

  // Generate progress data based on outcome current value
  const progressData = generateProgressData(outcome.current, outcome.target);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Outcome {outcomeId}</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">{outcome.title}</h1>
        <p className="text-muted-foreground mt-2">{outcome.description}</p>
      </div>

      {/* Outcome Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Progress
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{outcome.current}</div>
            <p className="text-xs text-muted-foreground">
              of {outcome.target} {outcome.unit}
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progress Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{outcome.progress}%</div>
            <p className="text-xs text-green-600">+5% from last month</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(outcome.status)}>
              {outcome.status.charAt(0).toUpperCase() + outcome.status.slice(1).replace('-', ' ')}
            </Badge>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Activities
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{relatedActivities.length}</div>
            <p className="text-xs text-muted-foreground">related activities</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Visualization and Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Progress Towards Target</CardTitle>
            <CardDescription>Visual representation of outcome achievement</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <RadialGauge 
              value={outcome.progress} 
              size={180} 
              thickness={12}
              unit="%" 
              primaryColor="#14B8A6"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Progress Timeline</CardTitle>
            <CardDescription>Monthly progress tracking</CardDescription>
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

      {/* Related Outputs */}
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Related Outputs</CardTitle>
          <CardDescription>Outputs that contribute to this outcome</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedOutputs.map((output) => (
              <div key={output.id} className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">Output {output.id}</h4>
                    <p className="text-sm text-muted-foreground">{output.title}</p>
                  </div>
                  <Badge className={getStatusColor(output.status)}>
                    {output.status.charAt(0).toUpperCase() + output.status.slice(1).replace('-', ' ')}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{Math.round((output.current / output.target) * 100)}%</span>
                  </div>
                  <Progress value={Math.round((output.current / output.target) * 100)} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{output.current} of {output.target} {output.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Related Activities */}
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Related Activities</CardTitle>
          <CardDescription>Activities contributing to this outcome</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {relatedActivities.map((activity) => (
              <div key={activity.id} className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">Activity {activity.id}: {activity.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1).replace('-', ' ')}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{Math.round((activity.current / activity.target) * 100)}%</span>
                  </div>
                  <Progress value={Math.round((activity.current / activity.target) * 100)} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Responsible: {activity.responsible}</span>
                    <span>Due: {new Date(activity.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
          <CardDescription>Summary of key metrics for this outcome</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{outcome.progress}%</div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{relatedOutputs.length}</div>
              <div className="text-sm text-muted-foreground">Related Outputs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{relatedActivities.length}</div>
              <div className="text-sm text-muted-foreground">Related Activities</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}