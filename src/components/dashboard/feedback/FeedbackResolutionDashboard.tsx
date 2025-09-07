import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  MessageSquare,
  BarChart3,
  Calendar,
  Target
} from 'lucide-react';

interface FeedbackResolutionDashboardProps {
  projectId: string;
}

export function FeedbackResolutionDashboard({ projectId }: FeedbackResolutionDashboardProps) {
  // Mock data for resolution metrics
  const mockMetrics = {
    totalSubmissions: 156,
    resolvedThisMonth: 89,
    averageResolutionTime: '3.2 days',
    escalationRate: '12%',
    satisfactionScore: 4.2,
    activeCases: 23,
    overdueCases: 5,
    teamWorkload: {
      'Sarah Wilson': 8,
      'Mike Johnson': 6,
      'Emergency Team': 4,
      'Admin Team': 5
    }
  };

  const mockTrends = {
    submissions: { current: 156, previous: 142, change: 9.9, trend: 'up' },
    resolutionTime: { current: 3.2, previous: 4.1, change: -22.0, trend: 'down' },
    satisfaction: { current: 4.2, previous: 3.8, change: 10.5, trend: 'up' },
    escalations: { current: 12, previous: 18, change: -33.3, trend: 'down' }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const getTrendColor = (trend: string, change: number) => {
    if (trend === 'up') {
      return change > 0 ? 'text-green-600' : 'text-red-600';
    } else {
      return change < 0 ? 'text-green-600' : 'text-red-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feedback Resolution Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitor and track feedback resolution performance and team workload
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button>
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold">{mockMetrics.totalSubmissions}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(mockTrends.submissions.trend)}
                  <span className={`text-sm ${getTrendColor(mockTrends.submissions.trend, mockTrends.submissions.change)}`}>
                    {mockTrends.submissions.change > 0 ? '+' : ''}{mockTrends.submissions.change}%
                  </span>
                </div>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved This Month</p>
                <p className="text-2xl font-bold">{mockMetrics.resolvedThisMonth}</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    {Math.round((mockMetrics.resolvedThisMonth / mockMetrics.totalSubmissions) * 100)}% resolution rate
                  </span>
                </div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Resolution Time</p>
                <p className="text-2xl font-bold">{mockMetrics.averageResolutionTime}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(mockTrends.resolutionTime.trend)}
                  <span className={`text-sm ${getTrendColor(mockTrends.resolutionTime.trend, mockTrends.resolutionTime.change)}`}>
                    {mockTrends.resolutionTime.change > 0 ? '+' : ''}{mockTrends.resolutionTime.change}%
                  </span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfaction Score</p>
                <p className="text-2xl font-bold">{mockMetrics.satisfactionScore}/5</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(mockTrends.satisfaction.trend)}
                  <span className={`text-sm ${getTrendColor(mockTrends.satisfaction.trend, mockTrends.satisfaction.change)}`}>
                    {mockTrends.satisfaction.change > 0 ? '+' : ''}{mockTrends.satisfaction.change}%
                  </span>
                </div>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview and Team Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Active Cases</span>
                </div>
                <Badge variant="default">{mockMetrics.activeCases}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span className="font-medium">Overdue Cases</span>
                </div>
                <Badge variant="destructive">{mockMetrics.overdueCases}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                  <span className="font-medium">Escalation Rate</span>
                </div>
                <Badge variant="destructive">{mockMetrics.escalationRate}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Workload */}
        <Card>
          <CardHeader>
            <CardTitle>Team Workload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(mockMetrics.teamWorkload).map(([member, workload]) => (
                <div key={member} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{member}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          workload > 6 ? 'bg-red-500' : 
                          workload > 4 ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(workload / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{workload}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Resolution Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: '1', title: 'Water quality concern resolved', user: 'Sarah Wilson', time: '2 hours ago', status: 'RESOLVED' },
              { id: '2', title: 'Safety incident escalated', user: 'Mike Johnson', time: '4 hours ago', status: 'ESCALATED' },
              { id: '3', title: 'Community feedback acknowledged', user: 'Admin Team', time: '6 hours ago', status: 'ACKNOWLEDGED' },
              { id: '4', title: 'Emergency report in progress', user: 'Emergency Team', time: '8 hours ago', status: 'IN_PROGRESS' }
            ].map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    {activity.status === 'RESOLVED' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                     activity.status === 'ESCALATED' ? <AlertTriangle className="w-4 h-4 text-red-600" /> :
                     activity.status === 'ACKNOWLEDGED' ? <MessageSquare className="w-4 h-4 text-blue-600" /> :
                     <Clock className="w-4 h-4 text-orange-600" />}
                  </div>
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">by {activity.user}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={activity.status === 'RESOLVED' ? 'default' : 'secondary'}>
                    {activity.status.replace('_', ' ')}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
