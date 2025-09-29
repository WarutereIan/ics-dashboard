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
import { useFeedback } from '@/contexts/FeedbackContext';
import { FeedbackSubmission } from '@/types/feedback';

interface FeedbackResolutionDashboardProps {
  projectId: string;
}

export function FeedbackResolutionDashboard({ projectId }: FeedbackResolutionDashboardProps) {
  const { submissions, loading } = useFeedback();

  // Calculate real metrics from submissions data
  const calculateMetrics = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Filter submissions by time periods
    const currentMonthSubmissions = submissions.filter(sub => {
      const date = new Date(sub.submittedAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const lastMonthSubmissions = submissions.filter(sub => {
      const date = new Date(sub.submittedAt);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    });

    // Calculate resolution metrics
    const resolvedSubmissions = submissions.filter(sub => sub.status === 'RESOLVED');
    const resolvedThisMonth = resolvedSubmissions.filter(sub => {
      const date = new Date(sub.submittedAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    // Calculate average resolution time
    const averageResolutionTime = calculateAverageResolutionTime(resolvedSubmissions);

    // Calculate escalation rate
    const escalatedSubmissions = submissions.filter(sub => sub.status === 'ESCALATED');
    const escalationRate = submissions.length > 0 ? (escalatedSubmissions.length / submissions.length * 100).toFixed(1) : '0';

    // Calculate active and overdue cases
    const activeCases = submissions.filter(sub => 
      ['SUBMITTED', 'ACKNOWLEDGED', 'IN_PROGRESS'].includes(sub.status)
    ).length;

    const overdueCases = submissions.filter(sub => {
      if (!['SUBMITTED', 'ACKNOWLEDGED', 'IN_PROGRESS'].includes(sub.status)) return false;
      const submittedDate = new Date(sub.submittedAt);
      const daysSinceSubmission = Math.floor((now.getTime() - submittedDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceSubmission > 7; // Consider overdue after 7 days
    }).length;

    // Calculate team workload
    const teamWorkload = calculateTeamWorkload(submissions);

    return {
      totalSubmissions: submissions.length,
      resolvedThisMonth: resolvedThisMonth.length,
      averageResolutionTime,
      escalationRate: `${escalationRate}%`,
      satisfactionScore: 4.2, // Placeholder - would need satisfaction data
      activeCases,
      overdueCases,
      teamWorkload
    };
  };

  // Calculate average resolution time
  const calculateAverageResolutionTime = (resolvedSubmissions: FeedbackSubmission[]): string => {
    if (resolvedSubmissions.length === 0) return 'N/A';
    
    const totalDays = resolvedSubmissions.reduce((sum, submission) => {
      const submittedAt = new Date(submission.submittedAt);
      const resolvedAt = submission.resolvedAt ? new Date(submission.resolvedAt) : new Date();
      const diffTime = Math.abs(resolvedAt.getTime() - submittedAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sum + diffDays;
    }, 0);
    
    const averageDays = (totalDays / resolvedSubmissions.length).toFixed(1);
    return `${averageDays} days`;
  };

  // Calculate team workload
  const calculateTeamWorkload = (submissions: FeedbackSubmission[]) => {
    const workload: Record<string, number> = {};
    
    submissions.forEach(submission => {
      if (submission.assignedTo && ['SUBMITTED', 'ACKNOWLEDGED', 'IN_PROGRESS'].includes(submission.status)) {
        workload[submission.assignedTo] = (workload[submission.assignedTo] || 0) + 1;
      }
    });

    return workload;
  };

  // Calculate trends (simplified - would need historical data for accurate trends)
  const calculateTrends = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthSubmissions = submissions.filter(sub => {
      const date = new Date(sub.submittedAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const lastMonthSubmissions = submissions.filter(sub => {
      const date = new Date(sub.submittedAt);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    });

    const currentCount = currentMonthSubmissions.length;
    const previousCount = lastMonthSubmissions.length;
    const change = previousCount > 0 ? ((currentCount - previousCount) / previousCount * 100) : 0;

    return {
      submissions: { 
        current: currentCount, 
        previous: previousCount, 
        change: change.toFixed(1), 
        trend: change >= 0 ? 'up' : 'down' 
      },
      resolutionTime: { current: 3.2, previous: 4.1, change: -22.0, trend: 'down' }, // Placeholder
      satisfaction: { current: 4.2, previous: 3.8, change: 10.5, trend: 'up' }, // Placeholder
      escalations: { current: 12, previous: 18, change: -33.3, trend: 'down' } // Placeholder
    };
  };

  const metrics = calculateMetrics();
  const trends = calculateTrends();

  // Helper function to format time ago
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
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

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-2xl font-bold">{metrics.totalSubmissions}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(trends.submissions.trend)}
                  <span className={`text-sm ${getTrendColor(trends.submissions.trend, parseFloat(trends.submissions.change))}`}>
                    {parseFloat(trends.submissions.change) > 0 ? '+' : ''}{trends.submissions.change}%
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
                <p className="text-2xl font-bold">{metrics.resolvedThisMonth}</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    {metrics.totalSubmissions > 0 ? Math.round((metrics.resolvedThisMonth / metrics.totalSubmissions) * 100) : 0}% resolution rate
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
                <p className="text-2xl font-bold">{metrics.averageResolutionTime}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(trends.resolutionTime.trend)}
                  <span className={`text-sm ${getTrendColor(trends.resolutionTime.trend, trends.resolutionTime.change)}`}>
                    {trends.resolutionTime.change > 0 ? '+' : ''}{trends.resolutionTime.change}%
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
                <p className="text-2xl font-bold">{metrics.satisfactionScore}/5</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(trends.satisfaction.trend)}
                  <span className={`text-sm ${getTrendColor(trends.satisfaction.trend, trends.satisfaction.change)}`}>
                    {trends.satisfaction.change > 0 ? '+' : ''}{trends.satisfaction.change}%
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
                <Badge variant="default">{metrics.activeCases}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span className="font-medium">Overdue Cases</span>
                </div>
                <Badge variant="destructive">{metrics.overdueCases}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                  <span className="font-medium">Escalation Rate</span>
                </div>
                <Badge variant="destructive">{metrics.escalationRate}</Badge>
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
              {Object.entries(metrics.teamWorkload).map(([member, workload]) => (
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
            {submissions
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 5)
              .map((submission) => {
                const timeAgo = getTimeAgo(new Date(submission.updatedAt));
                const title = submission.data?.title || submission.data?.description || `${submission.category?.name || 'Feedback'} Submission`;
                return (
                  <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                        {submission.status === 'RESOLVED' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                         submission.status === 'ESCALATED' ? <AlertTriangle className="w-4 h-4 text-red-600" /> :
                         submission.status === 'ACKNOWLEDGED' ? <MessageSquare className="w-4 h-4 text-blue-600" /> :
                     <Clock className="w-4 h-4 text-orange-600" />}
                  </div>
                  <div>
                        <p className="font-medium">{title}</p>
                        <p className="text-sm text-gray-500">by {submission.assignedTo || 'Unassigned'}</p>
                  </div>
                </div>
                <div className="text-right">
                      <Badge variant={submission.status === 'RESOLVED' ? 'default' : 'secondary'}>
                        {submission.status.replace('_', ' ')}
                  </Badge>
                      <p className="text-sm text-gray-500 mt-1">{timeAgo}</p>
                </div>
              </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
