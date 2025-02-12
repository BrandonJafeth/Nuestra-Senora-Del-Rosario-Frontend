import { useState } from "react";
import { useUserProfile } from "../../hooks/useUserProfile";
import { Icon } from "@iconify/react";
import UserProfileModal from "../microcomponents/UserProfileModal";
import LoadingSpinner from "../microcomponents/LoadingSpinner";
import { useThemeDark } from "../../hooks/useThemeDark";
import ChangePasswordModal from "../microcomponents/ChangePasswordModal";

const UserSettings: React.FC = () => {
  const { user, isLoading, error } = useUserProfile();
  const { isDarkMode } = useThemeDark();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleOpenModal = () => {
    if (user) setIsModalOpen(true); // Evita abrir si `user` es null
  };

  const handleCloseModal = () => setIsModalOpen(false);

  if (isLoading) {
    return (
      <p className={`text-center ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
        <LoadingSpinner />
      </p>
    );
  }

  if (error) {
    return (
      <p className={`text-center ${isDarkMode ? "text-red-400" : "text-red-500"}`}>
        Error al cargar los datos del usuario.
      </p>
    );
  }

  return (
    <div className={`flex justify-center items-center h-screen p-6 transition-colors duration-300 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div className={`max-w-4xl w-full p-8 rounded-lg shadow-lg transition-all duration-300 ${isDarkMode ? "bg-[#0D313F]" : "bg-white"}`}>
        {/* Título */}
        <h1 className="text-3xl font-semibold text-center mb-6">
          Configuración del Perfil del Usuario
        </h1>

        {/* Tarjeta de Información Personal */}
        <div className={`shadow-md rounded-lg p-6 mb-6 transition-colors duration-300 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Información Personal del Empleado</h2>
            <Icon icon="mdi:account-circle-outline" className="text-4xl text-blue-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <p><span className="font-semibold">Nombre de usuario:</span> {user?.fullName || "N/A"}</p>
            <p><span className="font-semibold">Cédula:</span> {user?.dni || "N/A"}</p>
            <p><span className="font-semibold">Email:</span> {user?.email || "N/A"}</p>
            <p><span className="font-semibold">Activo:</span> {user?.isActive ? "Sí" : "No"}</p>
            <p><span className="font-semibold">Roles:</span> {user?.roles?.join(", ") || "N/A"}</p>
          </div>
        </div>

        {/* Secciones de Cambio de Correo y Contraseña */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cambio de Nombre de Usuario y Correo */}
          <div className={`shadow-md rounded-lg p-6 flex flex-col items-start transition-colors duration-300 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            <div className="flex items-center mb-4">
              <Icon icon="mdi:account-outline" className="text-3xl mr-3 text-blue-500" />
              <h3 className="text-xl font-semibold">Información del Usuario</h3>
            </div>

            {/* Nombre de Usuario */}
            <p className="mb-2"><span className="font-semibold">Nombre de usuario:</span> {user?.fullName || "N/A"}</p>

            {/* Correo Electrónico */}
            <p className="mb-4"><span className="font-semibold">Correo:</span> {user?.email || "N/A"}</p>

            {/* Botón para abrir el modal */}
            <button
              onClick={handleOpenModal}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full text-center transition duration-200"
            >
              Cambiar Información del Usuario
            </button>
          </div>

          {/* Cambio de Contraseña */}
          <div className={`shadow-md rounded-lg p-6 flex flex-col items-start transition-colors duration-300 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            <div className="flex items-center mb-4">
              <Icon icon="mdi:lock-outline" className="text-3xl mr-3 text-blue-500" />
              <h3 className="text-xl font-semibold">Contraseña del Usuario</h3>
            </div>
            <p className="mb-4"><span className="font-semibold">Contraseña:</span> ********</p>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full text-center transition duration-200"
            >
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>
      <ChangePasswordModal
      isOpen={isPasswordModalOpen}
      onClose={() => setIsPasswordModalOpen(false)}
    />
      {/* Renderizar el modal solo si user no es undefined */}
      {user && <UserProfileModal isOpen={isModalOpen} onClose={handleCloseModal} user={user} />}
    </div>
  );
};

export default UserSettings;
