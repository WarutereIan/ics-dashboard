import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Flag,
  MessageSquare,
  User,
  Calendar,
  FileText
} from 'lucide-react';

interface StatusEntry {
  id: string;
  status: string;
  timestamp: string;
  user: string;
  details?: string;
  assignee?: string;
}

interface FeedbackStatusTrackerProps {
  statusHistory: StatusEntry[];
  currentStatus: string;
  assignedTo?: string;
  submittedAt: string;
  resolvedAt?: string;
}

export function FeedbackStatusTracker({ 
  statusHistory, 
  currentStatus, 
  assignedTo,
  submittedAt,
  resolvedAt 
}: FeedbackStatusTrackerProps) {
  
  const getStatusInfo = (status: string) => {
    const statusMap = {
      'SUBMITTED': { 
        icon: MessageSquare, 
        color: 'secondary', 
        label: 'Submitted',
        description: 'Feedback received and logged'
      },
      'ACKNOWLEDGED': { 
        icon: CheckCircle, 
        color: 'default', 
        label: 'Acknowledged',
        description: 'Submission acknowledged by team'
      },
      'IN_PROGRESS': { 
        icon: AlertCircle, 
        color: 'default', 
        label: 'In Progress',
        description: 'Work is being done to resolve the issue'
      },
      'RESOLVED': { 
        icon: CheckCircle, 
        color: 'default', 
        label: 'Resolved',
        description: 'Issue has been resolved'
      },
      'CLOSED': { 
        icon: XCircle, 
        color: 'outline', 
        label: 'Closed',
        description: 'Case closed and archived'
      },
      'ESCALATED': { 
        icon: Flag, 
        color: 'destructive', 
        label: 'Escalated',
        description: 'Issue escalated to higher authority'
      }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap['SUBMITTED'];
  };

  const getStatusProgress = (status: string) => {
    const statusOrder = ['SUBMITTED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    const currentIndex = statusOrder.indexOf(status);
    return {
      current: currentIndex + 1,
      total: statusOrder.length,
      percentage: ((currentIndex + 1) / statusOrder.length) * 100
    };
  };

  const progress = getStatusProgress(currentStatus);
  const currentStatusInfo = getStatusInfo(currentStatus);

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <currentStatusInfo.icon className="w-5 h-5" />
            Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant={currentStatusInfo.color as any} className="text-sm">
                  {currentStatusInfo.label}
                </Badge>
                <span className="text-sm text-gray-600">{currentStatusInfo.description}</span>
              </div>
              {assignedTo && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  {assignedTo}
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{progress.current} of {progress.total} steps</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Submitted: {new Date(submittedAt).toLocaleDateString()}</span>
              </div>
              {resolvedAt && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Resolved: {new Date(resolvedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status History */}
      <Card>
        <CardHeader>
          <CardTitle>Status History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusHistory.map((entry, index) => {
              const statusInfo = getStatusInfo(entry.status);
              const isLast = index === statusHistory.length - 1;
              
              return (
                <div key={entry.id} className="flex items-start gap-3">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className={`p-2 rounded-full ${
                      isLast ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <statusInfo.icon className="w-4 h-4" />
                    </div>
                    {!isLast && (
                      <div className="w-px h-8 bg-gray-200 mt-2" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={statusInfo.color as any} className="text-xs">
                        {statusInfo.label}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {entry.details && (
                      <p className="text-sm text-gray-600 mb-1">{entry.details}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>by {entry.user}</span>
                      {entry.assignee && (
                        <span>assigned to {entry.assignee}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Time to Acknowledge</p>
                <p className="text-lg font-semibold">2 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Time in Progress</p>
                <p className="text-lg font-semibold">3 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Resolution Time</p>
                <p className="text-lg font-semibold">
                  {resolvedAt ? '5 days' : 'In progress'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
