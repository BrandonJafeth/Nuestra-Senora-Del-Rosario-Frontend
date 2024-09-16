import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequestsPassword } from '../../hooks/useRequestsPassword';
import LoadingSpinner from '../microcomponents/LoadingSpinner';

function RequestPasswordForm() {
  const [email, setEmail] = useState('');
  const [cedula, setCedula] = useState('');
  const navigate = useNavigate();

  const { mutate: resetPassword, isLoading, isError, isSuccess } = useRequestsPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ejecuta la función de restablecimiento de contraseña con el email ingresado
    resetPassword(email, {
      onSuccess: () => {
      },
      onError: (error: any) => {
        // Manejar el error si ocurre
        console.error('Error al enviar enlace de restablecimiento:', error);
      },
    });
  };

  const handleCancel = () => {
    // Función para manejar la cancelación, puede ser redirigir o limpiar los campos
    setEmail('');
    setCedula('');
    navigate('/'); // Redirigir a la página de inicio u otra página deseada
  };

  return (
    <div className="flex flex-col space-y-6">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <div className="w-full">
          <label htmlFor="email" className="block text-white">Correo Electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="Ingrese su correo electrónico"
            className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </form>

      {/* Botones fuera del form */}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 px-4 py-2 bg-[#c62b2b] text-white text-lg font-inter rounded-md shadow-md transition-transform transform hover:scale-105 hover:bg-[#a52222]"
        tabIndex={1}
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          tabIndex={0}
          className={`flex-1 px-4 py-2 bg-[#233d63] text-white text-lg font-inter rounded-md shadow-md transition-transform transform hover:scale-105 hover:bg-[#1b2f52] ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : 'Enviar enlace de restablecimiento'}
        </button>
      </div>

      {isError && <p className="text-red-500">Error al enviar el enlace de restablecimiento. Por favor, inténtelo de nuevo.</p>}
      {isSuccess && <p className="text-green-500">Enlace de restablecimiento enviado exitosamente.</p>}
    </div>
  );
}

export default RequestPasswordForm;
