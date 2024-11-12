// src/components/NotificationMailbox.tsx
import { FaArrowLeft } from "react-icons/fa";
import NotesComponent from "../microcomponents/NoteComponent";
import NotificationComponent from "../microcomponents/Notification";
import { useNavigate } from "react-router-dom";

const NotificationMailbox = () => {
  const navigate = useNavigate(); // Hook para navegación

  const handleNavigate = () => {
    navigate("/dashboard/cronograma-citas"); // Redireccionar
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-5xl mx-auto mt-10">
      {/* Contenedor Flex para el botón y el título */}
      <div className="flex justify-between items-center mb-6">
        {/* Botón de regresar */}
        <button
          onClick={handleNavigate}
          className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <FaArrowLeft size={20} />
          <span className="text-lg font-semibold">Regresar</span>
        </button>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mr-64">
  Bandeja de Notificaciones y Notas
</h1>

      </div>

      {/* Contenido en Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sección de Notificaciones */}
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow">
          <NotificationComponent />
        </div>

        {/* Sección de Notas */}
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow">
          <NotesComponent />
        </div>
      </div>
    </div>
  );
};

export default NotificationMailbox;
