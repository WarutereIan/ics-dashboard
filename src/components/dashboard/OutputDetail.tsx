import React from 'react';
import { useParams } from 'react-router-dom';
import { Target, TrendingUp, Calendar, Users, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadialGauge } from '@/components/visualizations/RadialGauge';
import { AreaChart } from '@/components/visualizations/AreaChart';
import { PieChart } from '@/components/visualizations/PieChart';
import { StackedBarChart } from '@/components/visualizations/StackedBarChart';
import { LineChart } from '@/components/visualizations/LineChart';
import { BarChart } from '@/components/visualizations/BarChart';
import { BulletChart } from '@/components/visualizations/BulletChart';
import { HeatmapCalendar } from '@/components/visualizations/HeatmapCalendar';
import { LikertScaleChart } from '@/components/visualizations/LikertScaleChart';
import { 
  comprehensiveOutputsData, 
  comprehensiveActivitiesData,
  generateProgressData,
  getStatusColor,
  getVisualizationData
} from '@/lib/mockData';

// Visualization renderer component
const VisualizationRenderer = ({ outputId }: { outputId: string }) => {
  const vizData = getVisualizationData(outputId);
  
  if (!vizData) {
    return <div className="text-center text-muted-foreground">No visualization data available</div>;
  }

  switch (vizData.type) {
    case 'radialGauge':
      return (
        <RadialGauge
          value={vizData.value}
          max={vizData.target}
          unit={vizData.unit}
          autoColorCode={vizData.useColorCoding}
          size={180}
          thickness={12}
        />
      );
    
    case 'pieChart':
      return (
        <PieChart
          data={vizData.data}
          innerRadius={vizData.innerRadius}
          interactive={vizData.interactive}
          height={200}
        />
      );
    
    case 'stackedBarChart':
      return (
        <StackedBarChart
          data={vizData.data}
          height={200}
        />
      );
    
    case 'areaChart':
      return (
        <AreaChart
          data={vizData.data}
          showCumulative={vizData.showCumulative}
          height={200}
        />
      );
    
    case 'lineChart':
      return (
        <LineChart
          data={vizData.data}
          lines={vizData.lines}
          milestones={vizData.milestones}
          height={200}
        />
      );
    
    case 'barChart':
      return (
        <BarChart
          data={vizData.data}
          bars={vizData.bars}
          height={200}
        />
      );
    
    case 'bulletChart':
      return (
        <BulletChart
          current={vizData.current}
          target={vizData.target}
          title={`${vizData.current} of ${vizData.target} ${vizData.unit}`}
          unit={vizData.unit}
          qualitativeRanges={vizData.qualitativeRanges}
        />
      );
    
    case 'heatmapCalendar':
      return (
        <HeatmapCalendar
          data={vizData.data}
          height={200}
        />
      );
    
    case 'likertScale':
      return (
        <LikertScaleChart
          data={vizData.data}
          height={250}
        />
      );
    
    case 'pieAndTrend':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-sm font-medium mb-2">Current Usage</h5>
            <PieChart
              data={vizData.pieData}
              height={150}
              showLegend={false}
            />
          </div>
          <div>
            <h5 className="text-sm font-medium mb-2">Usage Trend</h5>
            <LineChart
              data={vizData.trendData}
              height={150}
              showLegend={false}
            />
          </div>
        </div>
      );
    
    case 'progressBar':
      return (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">{vizData.current}</div>
            <div className="text-sm text-muted-foreground">of {vizData.target} {vizData.unit}</div>
          </div>
          <Progress value={(vizData.current / vizData.target) * 100} className="h-3" />
          <div className="grid grid-cols-3 gap-2 text-center">
            {vizData.breakdown.map((item, index) => (
              <div key={index} className="text-sm">
                <div className="font-medium">{item.value}</div>
                <div className="text-muted-foreground">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      );
    
    default:
      return (
        <div className="text-center text-muted-foreground">
          Visualization type not supported
        </div>
      );
  }
};

export function OutputDetail() {
  const { outputId, outcomeId } = useParams();
  const output = comprehensiveOutputsData[outputId as keyof typeof comprehensiveOutputsData];

  if (!output) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Output not found</h2>
          <p className="text-muted-foreground mt-2">Output {outputId} could not be found.</p>
        </div>
      </div>
    );
  }

  // Get related activities
  const relatedActivities = output.activities.map(activityId => comprehensiveActivitiesData[activityId as keyof typeof comprehensiveActivitiesData]).filter(Boolean);

  // Generate progress data based on output current value
  const progressData = generateProgressData(output.current, output.target);

  const progressPercentage = Math.round((output.current / output.target) * 100);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Outcome {outcomeId}</span>
          <span>•</span>
          <span>Output {outputId}</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Output {outputId}: {output.title}</h1>
        <p className="text-muted-foreground mt-2">{output.description}</p>
      </div>

      {/* Output Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Achievement
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{output.current}</div>
            <p className="text-xs text-muted-foreground">
              of {output.target} {output.unit}
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
            <div className="text-2xl font-bold text-foreground">{progressPercentage}%</div>
            <p className="text-xs text-green-600">+3% from last month</p>
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
            <Badge className={getStatusColor(output.status)}>
              {output.status.charAt(0).toUpperCase() + output.status.slice(1).replace('-', ' ')}
            </Badge>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contributing Activities
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{relatedActivities.length}</div>
            <p className="text-xs text-muted-foreground">related activities</p>
          </CardContent>
        </Card>
      </div>

      {/* Specialized Visualization */}
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Performance Visualization</CardTitle>
          <CardDescription>
            Specialized visualization for Output {outputId} based on data type and requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <VisualizationRenderer outputId={outputId!} />
        </CardContent>
      </Card>

      {/* Progress Timeline */}
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Progress Timeline</CardTitle>
          <CardDescription>Monthly achievement tracking over time</CardDescription>
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

      {/* Contributing Activities */}
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Contributing Activities</CardTitle>
          <CardDescription>Activities that contribute to this output</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {relatedActivities.map((activity) => (
              <div key={activity.id} className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-foreground">Activity {activity.id}: {activity.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 ml-8">{activity.description}</p>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1).replace('-', ' ')}
                  </Badge>
                </div>
                <div className="ml-8 space-y-2">
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
          <CardDescription>Detailed metrics for this output</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Achievement Rate</span>
                <span className="text-sm text-muted-foreground">{output.current}/{output.target} {output.unit}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{progressPercentage}%</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{output.target - output.current}</div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{relatedActivities.length}</div>
                <div className="text-sm text-muted-foreground">Contributing Activities</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 