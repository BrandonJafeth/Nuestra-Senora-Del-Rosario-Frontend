// src/components/NotificationComponent.tsx
import React, { useEffect, useState } from 'react';
import { useNotification } from '../../hooks/useNotification';
import { motion, AnimatePresence } from 'framer-motion'; // Para animaciones opcionales

const NotificationComponent: React.FC = () => {
  const { notifications, loading, error, markAsRead } = useNotification();
  const [showPopup, setShowPopup] = useState<boolean>(false); // Controlar notificación emergente
  const [newNotification, setNewNotification] = useState<any | null>(null); // Notificación reciente

  // Detectar si hay una nueva notificación
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0]; // Obtener la más reciente
      setNewNotification(latestNotification);
      setShowPopup(true); // Mostrar notificación emergente

      // Ocultar la notificación emergente después de 3 segundos
      const timer = setTimeout(() => setShowPopup(false), 3000);

      return () => clearTimeout(timer); // Limpiar el temporizador al desmontar
    }
  }, [notifications]);

  if (loading) return <p>Cargando notificaciones...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Notificaciones
      </h2>

      {notifications.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No tienes notificaciones pendientes.
        </p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <strong className="text-blue-800 dark:text-blue-300">
                  {notification.title}
                </strong>
                <p className="text-gray-700 dark:text-gray-400">
                  {notification.message}
                </p>
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  {new Date(notification.createdAt).toLocaleString('es-CR')}
                </span>
              </div>
              <button
                onClick={() => markAsRead(notification.id)}
                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Marcar como leída
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Popup de Nueva Notificación */}
      <AnimatePresence>
        {showPopup && newNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white p-6 rounded-lg shadow-lg"
          >
            <h3 className="text-lg font-bold">{newNotification.title}</h3>
            <p>{newNotification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationComponent;
