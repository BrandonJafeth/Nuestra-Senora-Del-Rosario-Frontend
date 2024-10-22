// src/hooks/useNotification.ts
import { useEffect, useState } from 'react';
import { NotificationGetDto } from '../types/NotificationType';
import NotificationService from '../services/NotificationService';


export const useNotification = () => {
  const [notifications, setNotifications] = useState<NotificationGetDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await NotificationService.getUnreadNotifications();
        setNotifications(data);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener notificaciones:', err);
        setError('Error al obtener notificaciones.');
        setLoading(false);
      }
    };

    // Escucha de nuevas notificaciones en tiempo real
    NotificationService.onNotificationReceived((notification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    fetchNotifications();

    // Desconectar la conexión de SignalR al desmontar el componente
    return () => {
      NotificationService.disconnect();
    };
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Error al marcar la notificación como leída:', err);
      setError('Error al marcar la notificación como leída.');
    }
  };

  return { notifications, loading, error, markAsRead };
};
