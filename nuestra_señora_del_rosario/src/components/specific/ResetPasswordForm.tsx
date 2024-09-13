import React, { useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';  // Asegúrate de que el link a inicio de sesión funcione correctamente.

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    console.log('Restablecer contraseña:', { newPassword });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {/* Input para nueva contraseña */}
      <div className="w-full mb-4">
        <div className="w-full bg-[#f2f4f7] dark:bg-gray-700 rounded-[15px] flex items-center px-4 py-3">
          <FiLock className="text-[#606262] dark:text-gray-400 text-2xl mr-4" />
          <input 
            type="password" 
            placeholder="Por favor, escriba su nueva contraseña" 
            className="w-full bg-transparent outline-none text-[#606262] dark:text-gray-300 text-lg font-normal font-Poppins" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Input para confirmar contraseña */}
      <div className="w-full">
        <div className="w-full bg-[#f2f4f7] dark:bg-gray-700 rounded-[15px] flex items-center px-4 py-3">
          <FiLock className="text-[#606262] dark:text-gray-400 text-2xl mr-4" />
          <input 
            type="password" 
            placeholder="Confirme su contraseña" 
            className="w-full bg-transparent outline-none text-[#606262] dark:text-gray-300 text-lg font-normal font-Poppins" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Agregar más espacio antes de la fila del botón y el texto */}
      <div className="w-full mt-8 flex justify-between items-center">
        {/* Botón para restablecer contraseña */}
        <button 
          type="submit" 
          className="bg-[#f2f4f7] dark:bg-gray-600 text-[#0d313f] dark:text-white py-3 px-6 rounded-full shadow-lg hover:bg-[#e6e8ec] dark:hover:bg-gray-500 transition"
        >
          Restablecer contraseña
        </button>

        {/* Texto de "¿Recordó su contraseña?" en una columna */}
        <div className="flex flex-col items-end space-y-2 text-white text-sm">
          <p className="font-normal">¿Recordó su contraseña?</p>
          <Link to="/inicio-de-sesion" className="font-bold underline">
            Regrese al inicio de sesión
          </Link>
        </div>
      </div>
    </form>
  );
}

export default ResetPasswordForm;
