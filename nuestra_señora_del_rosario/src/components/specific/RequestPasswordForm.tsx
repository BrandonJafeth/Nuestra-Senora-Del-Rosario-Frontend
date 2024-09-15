import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResetPassword } from '../../hooks/useResetPassword';
import LoadingSpinner from '../microcomponents/LoadingSpinner';

function RequestPasswordForm() {
  const [email, setEmail] = useState('');
  const [cedula, setCedula] = useState('');
  const navigate = useNavigate();

  const { mutate: resetPassword, isLoading, isError, isSuccess } = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ejecuta la función de restablecimiento de contraseña con el email ingresado
    resetPassword(email, {
      onSuccess: () => {
        // Redirigir al usuario a la página de confirmación si la solicitud fue exitosa
        navigate('/restablecer-contraseña');
      },
      onError: (error: any) => {
        // Manejar el error si ocurre
        console.error("Error al enviar enlace de restablecimiento:", error);
      },
    });
  };

  return (
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

      <button
        type="submit" 
        className={`w-full bg-blue-600 text-white py-3 rounded-full shadow-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isLoading}
      >
        {isLoading ? <LoadingSpinner/> : 'Enviar enlace de restablecimiento'}
      </button>

      {isError && <p className="text-red-500">Error al enviar el enlace de restablecimiento. Por favor, inténtelo de nuevo.</p>}
      {isSuccess && <p className="text-green-500">Enlace de restablecimiento enviado exitosamente.</p>}
    </form>
  );
}

export default RequestPasswordForm;
