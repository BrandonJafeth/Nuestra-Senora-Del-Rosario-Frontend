import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Icon } from "@iconify/react";

const UserSettings: React.FC = () => {
  const { payload } = useAuth();

  const handleChangeEmail = () => {
    console.log("Abrir modal para cambiar correo");
  };

  const handleChangePassword = () => {
    console.log("Abrir modal para cambiar contraseña");
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
        {/* Título */}
        <h1 className="text-3xl font-semibold text-center mb-6">
          Configuración del Perfil del Usuario
        </h1>

        {/* Tarjeta de Información Personal */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Información Personal del Empleado</h2>
            <Icon icon="mdi:account-circle-outline" className="text-3xl" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <p><span className="font-semibold">Nombre de usuario:</span> {payload?.username || "N/A"}</p>
            <p><span className="font-semibold">Cédula:</span> {payload?.id || "N/A"}</p>
            <p><span className="font-semibold">Email:</span> {payload?.email || "N/A"}</p>
            <p><span className="font-semibold">Activo:</span> {payload?.isActive ? "Sí" : "No"}</p>
            <p><span className="font-semibold">Roles:</span> {payload?.roles?.join(", ") || "N/A"}</p>
          </div>
        </div>

        {/* Secciones de Cambio de Correo y Contraseña */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cambio de Correo */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-start">
            <div className="flex items-center mb-4">
              <Icon icon="mdi:email-outline" className="text-3xl mr-3" />
              <h3 className="text-xl font-semibold">Correo Electrónico</h3>
            </div>
            <p className="text-gray-600 mb-4">
              <span className="font-semibold">Correo:</span> {payload?.email || "N/A"}
            </p>
            <button
              onClick={handleChangeEmail}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full text-center"
            >
              Cambiar Correo Electrónico
            </button>
          </div>

          {/* Cambio de Contraseña */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-start">
            <div className="flex items-center mb-4">
              <Icon icon="mdi:lock-outline" className="text-3xl mr-3" />
              <h3 className="text-xl font-semibold">Contraseña</h3>
            </div>
            <p className="text-gray-600 mb-4">
              <span className="font-semibold">Contraseña:</span> ********
            </p>
            <button
              onClick={handleChangePassword}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full text-center"
            >
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
