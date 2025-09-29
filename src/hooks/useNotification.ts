import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationType } from '@/types/notification';

export const useNotification = () => {
  const { addNotification } = useNotifications();

  const showSuccess = (title: string, message?: string, duration?: number) => {
    addNotification({
      type: 'success',
      title,
      message,
      duration,
    });
  };

  const showError = (title: string, message?: string, duration?: number) => {
    addNotification({
      type: 'error',
      title,
      message,
      duration,
    });
  };

  const showWarning = (title: string, message?: string, duration?: number) => {
    addNotification({
      type: 'warning',
      title,
      message,
      duration,
    });
  };

  const showInfo = (title: string, message?: string, duration?: number) => {
    addNotification({
      type: 'info',
      title,
      message,
      duration,
    });
  };

  const showNotification = (
    type: NotificationType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    addNotification({
      type,
      title,
      message,
      duration,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showNotification,
  };
};
