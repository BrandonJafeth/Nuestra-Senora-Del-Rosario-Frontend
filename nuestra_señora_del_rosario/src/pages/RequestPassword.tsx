import React from 'react';

import { useThemeDark } from '../hooks/useThemeDark';
import RequestPasswordForm from '../components/specific/RequestPasswordForm';

function RequestPassword() {
  const { isDarkMode, toggleDarkMode } = useThemeDark();

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-gray-900' : 'bg-[#f2f4f7]'}`}>
      {/* Botón para alternar entre modo oscuro y claro */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 transition"
      >
        {isDarkMode ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
      </button>
      
      {/* Contenedor del formulario con sombra */}
      <div className="relative w-full max-w-md p-8 bg-[#0f1728] text-white rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">Solicitar Restablecimiento</h2>
        <p className="mb-6">Por favor, ingrese su correo y cédula para recibir un enlace de restablecimiento de contraseña.</p>
        <RequestPasswordForm />
      </div>
    </div>
  );
}

export default RequestPassword;
