import { FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useResetPassword } from '../../hooks/useResetPassword';
import Toast from '../common/Toast'; // Importamos el componente Toast
import { useState } from 'react';

function ResetPasswordForm() {
  const { 
    handleSubmit, 
    isLoading, 
    newPassword, 
    setNewPassword, 
    confirmPassword, 
    setConfirmPassword, 
    message, 
    type 
  } = useResetPassword();

  // Estado para manejar errores de validación
  const [error, setError] = useState('');

  // Función para validar la longitud de la contraseña
  const validatePassword = (password: string | any[]) => {
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
    } else {
      setError('');
    }
  };

  return (
    <div className="relative">
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (newPassword.length >= 8) {
            handleSubmit(e);  // Sólo permite el envío si la contraseña tiene al menos 8 caracteres
          } else {
            setError('La contraseña debe tener al menos 8 caracteres.');
          }
        }} 
        className="flex flex-col space-y-4"
      >
        {/* Input para nueva contraseña */}
        <div className="w-full mb-4">
          <div className="w-full bg-[#f2f4f7] dark:bg-gray-700 rounded-[15px] flex items-center px-4 py-3">
            <FiLock className="text-[#606262] dark:text-gray-400 text-2xl mr-4" />
            <input 
              type="password" 
              placeholder="Por favor, escriba su nueva contraseña" 
              className="w-full bg-transparent outline-none text-[#606262] dark:text-gray-300 text-lg font-normal font-Poppins" 
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                validatePassword(e.target.value); // Validar la contraseña en cada cambio
              }}
              required
            />
          </div>
          {/* Mensaje de error de validación */}
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
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

        {/* Mostrar spinner o botón para actualizar */}
        <div className="w-full mt-8 flex justify-between items-center">
        <button 
  type="submit" 
  className={`bg-[#f2f4f7] dark:bg-gray-600 text-[#0d313f] dark:text-white py-3 px-6 rounded-full shadow-lg hover:bg-[#e6e8ec] dark:hover:bg-gray-500 transition ${
    isLoading ? 'opacity-50 cursor-not-allowed' : ''
  }`}
  disabled={isLoading || Boolean(error)}
>
  {isLoading ? 'Actualizando...' : 'Restablecer contraseña'}
</button>


          {/* Texto de "¿Recordó su contraseña?" en una columna */}
          <div className="flex flex-col items-end space-y-2 text-white text-sm">
            <p className="font-normal">¿Recordó su contraseña?</p>
            <Link to="/" className="font-bold underline">
              Regrese al inicio de sesión
            </Link>
          </div>
        </div>
      </form>

      {/* Componente Toast */}
      <Toast message={message} type={type} />
    </div>
  );
}

export default ResetPasswordForm;
