import React from 'react';
import ButtonLogin from '../common/ButtonLogin';
import TextInput from '../common/TextInput';
import Toast from '../common/Toast';
import useLogin from '../../hooks/useLogin';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import { Link } from 'react-router-dom';
import { useThemeDark } from '../../hooks/useThemeDark';

const LoginForm: React.FC = () => {
  const { cedula, handleLogin, message, password, setCedula, setPassword, type, isLoading } = useLogin();
  const { isDarkMode } = useThemeDark();

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
