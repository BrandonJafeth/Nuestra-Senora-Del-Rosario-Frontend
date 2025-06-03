import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Componente que se muestra cuando el token ha expirado o el usuario ha cerrado sesión.
 * Ofrece un botón para volver al login ("/").
 */
const SessionExpired: React.FC = () => {
  const navigate = useNavigate();

  const handleReLogin = () => {
    // Redirige al login ("/")
    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-sm text-center">
        <h1 className="text-2xl font-semibold mb-4">Sesión expirada</h1>
        <p className="text-gray-700 mb-6">
          Tu sesión ha expirado o ya no estás autenticado. Por favor, inicia sesión de nuevo para continuar.
        </p>
        <button
          onClick={handleReLogin}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Volver a iniciar sesión
        </button>
      </div>
    </div>
  );
};

export default SessionExpired;
