import { useEffect } from 'react';

export const useNotificationFetcher = () => {
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('https://localhost:7066/api/Notification');
        const notifications = await response.json();

        notifications.forEach((notification : any) => {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(notification.title, {
              body: notification.message,
              data: { appointmentId: notification.appointmentId },
              icon: '/icon.png',
            });
          });
        });
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    const intervalId = setInterval(fetchNotifications, 60000); // Cada 1 minuto
    return () => clearInterval(intervalId);
  }, []);
};
