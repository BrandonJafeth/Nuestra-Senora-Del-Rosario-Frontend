import { useNotifications } from "../../hooks/useNotification";
import LoadingSpinner from "./LoadingSpinner";

const Notifications = () => {
  const { data: notifications, isLoading, error, markAsRead } = useNotifications();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>Error al cargar las notificaciones.</p>;

  return (
    <div className="p-4 rounded-lg shadow-lg bg-white dark:bg-[#1f2937]">
      <h2 className="text-xl font-bold mb-4">Notificaciones</h2>
      {notifications?.length ? (
        <ul className="space-y-4">
          {notifications.map((notification: any) => (
            <li
              key={notification.id}
              className="p-4 bg-gray-100 dark:bg-[#374151] rounded-lg shadow"
            >
              <p className="font-semibold">{notification.title}</p>
              <p>{notification.message}</p>
              <p className="text-sm text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
              {!notification.isRead && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Marcar como leída
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes notificaciones pendientes.</p>
      )}
    </div>
  );
};

export default Notifications;
