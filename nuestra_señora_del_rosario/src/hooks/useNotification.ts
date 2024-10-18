import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const API_URL = 'https://localhost:7066/api/Notification';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Cargar las notificaciones no leídas
  const { data, isLoading, error } = useQuery('notifications', async () => {
    const response = await axios.get(API_URL);
    return response.data;
  });

  // Mutación para marcar una notificación como leída
  const markAsRead = useMutation(
    (notificationId: number) =>
      axios.put(`${API_URL}/${notificationId}`), // Realiza la petición PUT
    {
      onSuccess: () => {
        // Refresca las notificaciones después de marcar como leída
        queryClient.invalidateQueries('notifications');
      },
    }
  );

  return {
    data,
    isLoading,
    error,
    markAsRead: (id: number) => markAsRead.mutate(id), // Exponer la mutación
  };
};
