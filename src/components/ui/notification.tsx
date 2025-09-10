import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Notification } from '@/types/notification';
import { Button } from './button';

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const getNotificationStyles = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800';
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    case 'info':
      return 'bg-blue-50 border-blue-200 text-blue-800';
    default:
      return 'bg-blue-50 border-blue-200 text-blue-800';
  }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRemove }) => {
  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 rounded-lg border shadow-lg
        animate-in slide-in-from-right-full duration-300
        ${getNotificationStyles(notification.type)}
      `}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getNotificationIcon(notification.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold">{notification.title}</h4>
        {notification.message && (
          <p className="text-sm mt-1 opacity-90">{notification.message}</p>
        )}
        {notification.action && (
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={notification.action.onClick}
          >
            {notification.action.label}
          </Button>
        )}
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className="flex-shrink-0 h-6 w-6 p-0 hover:bg-black/10"
        onClick={() => onRemove(notification.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({ 
  notifications, 
  onRemove 
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};
