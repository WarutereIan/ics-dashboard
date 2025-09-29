import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, ExternalLink } from 'lucide-react';
import { getActivityContributionToGoals } from '@/lib/organizationalGoals';

interface ActivityGoalContributionsProps {
  projectId: string;
  activityId: string;
  activityTitle: string;
}

export function ActivityGoalContributions({ 
  projectId, 
  activityId, 
  activityTitle 
}: ActivityGoalContributionsProps) {
  const contributions = getActivityContributionToGoals(projectId, activityId);

  if (contributions.length === 0) {
    return null;
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

  const totalContribution = contributions.reduce((sum, contrib) => sum + contrib.contribution, 0);
  const averageContribution = Math.round(totalContribution / contributions.length);

  return (
    <Card className="mt-4 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Organizational Goal Contributions
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {contributions.length} goal{contributions.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          How "{activityTitle}" contributes to organizational strategic goals
        </p>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">Average Contribution</span>
            <span className="text-lg font-bold text-blue-900">{averageContribution}%</span>
          </div>
          <Progress value={averageContribution} className="mt-2 h-2" />
        </div>

        {/* Individual Contributions */}
        <div className="space-y-3">
          {contributions.map((contribution, index) => (
            <div 
              key={index}
              className="flex items-start justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-foreground mb-1">
                      {contribution.goalTitle}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {contribution.subGoalTitle}
                    </p>
                  </div>
                  <Badge className={getStatusColor(contribution.status)} variant="secondary">
                    {contribution.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-muted-foreground">Contribution</span>
                      <span className="text-sm font-bold text-foreground">{contribution.contribution}%</span>
                    </div>
                    <Progress value={contribution.contribution} className="h-2" />
                  </div>
                  
                  <Link to={`/dashboard/goals/${contribution.goalId}/subgoals/${contribution.subGoalId}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-3 border-t border-muted">
          <div className="flex gap-2">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                View All Goals
              </Button>
            </Link>
            {contributions.length > 0 && (
              <Link to={`/dashboard/goals/${contributions[0].goalId}`}>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  View Primary Goal
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}