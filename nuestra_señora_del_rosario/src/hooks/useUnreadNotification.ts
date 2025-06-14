import { useEffect, useState } from 'react';
import axios from 'axios';

const useUnreadNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('https://bw48008o8ooo848csscss8o0.hogarnuestrasenoradelrosariosantacruz.org/api/Notification');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error al obtener las notificaciones:', error);
      }
    };

    fetchNotifications();
  }, []);

  return notifications;
};

export default useUnreadNotifications;
