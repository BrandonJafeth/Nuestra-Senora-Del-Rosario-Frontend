import NotificationComponent from "../microcomponents/Notification";

const NotificationMailbox = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Bandeja de Notificaciones
      </h1>
      <NotificationComponent /> {/* Mostrar las notificaciones */}
    </div>
  );
};

export default NotificationMailbox;
