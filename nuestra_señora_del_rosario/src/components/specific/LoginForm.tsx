import React from 'react';
import ButtonLogin from '../common/ButtonLogin'; // Componente de botón de inicio de sesión
import TextInput from '../common/TextInput'; // Componente de campo de entrada de texto
import Toast from '../common/Toast'; // Componente de Toast para mostrar mensajes
import useLogin from '../../hooks/useLogin'; // Hook personalizado para manejar el inicio de sesión
import LoadingSpinner from '../microcomponents/LoadingSpinner'; // Componente de spinner de carga
import { Link } from 'react-router-dom'; // Componente Link para la navegación
import { useThemeDark } from '../../hooks/useThemeDark'; // Hook para manejar el modo oscuro

const LoginForm: React.FC = () => {
  const { cedula, handleLogin, message, password, setCedula, setPassword, type, isLoading } = useLogin(); // Hook de login
  const { isDarkMode } = useThemeDark(); // Hook para el modo oscuro

  return (
    <div
      className={`w-96 p-8 rounded-lg shadow-lg transition ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      {/* Título y subtítulo */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Iniciar Sesión</h2>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Por favor, llene la información a continuación
        </p>
      </div>

      {/* Campos de entrada */}
      <TextInput
        type="text"
        placeholder="Cédula"
        value={cedula}
        onChange={(e) => setCedula(e.target.value)}
        isDarkMode={isDarkMode}
      />
      <TextInput
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        isDarkMode={isDarkMode}
      />

      {/* Mostrar Spinner o Botón */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ButtonLogin text="Iniciar sesión" onClick={handleLogin} isDarkMode={isDarkMode} />
      )}

      {/* Enlace de recuperación de contraseña */}
      <div className="text-center mt-4">
        <Link
          to="/solicitar-restablecimiento"
          className={`font-medium ${isDarkMode ? 'text-blue-500 hover:underline' : 'text-blue-600 hover:underline'}`}
        >
          ¿Olvidó su contraseña?
        </Link>
      </div>

      {/* Componente Toast */}
      <Toast message={message} type={type} />
    </div>
  );
};

export default LoginForm;
