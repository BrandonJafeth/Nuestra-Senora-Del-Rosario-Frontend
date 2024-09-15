import ButtonLogin from '../common/ButtonLogin';
import TextInput from '../common/TextInput';
import Toast from '../common/Toast';
import useLogin from '../../hooks/useLogin';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const { cedula, handleLogin, message, password, setCedula, setPassword, type, isLoading } = useLogin();

  return (
    <div className="w-96 bg-white p-8 rounded-lg shadow-lg">
      {/* Título y subtítulo */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
        <p className="text-gray-600">Por favor, llene la información a continuación</p>
      </div>

      {/* Campos de entrada */}
      <TextInput
        type="text"
        placeholder="Cédula"
        iconName="Cedula"
        value={cedula}
        onChange={(e) => setCedula(e.target.value)}
      />
      <TextInput
        type="password"
        placeholder="Contraseña"
        iconName="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Mostrar Spinner o Botón */}
      {isLoading ? (
       <LoadingSpinner/>
      ) : (
        <ButtonLogin text="Iniciar sesión" onClick={handleLogin} />
      )}

      {/* Enlace de recuperación de contraseña */}
      <div className="text-center mt-4">
        <Link to='/solicitar-restablecimiento' className="text-blue-600 hover:underline font-medium">
          ¿Olvidó su contraseña?
        </Link>
      </div>

      {/* Componente Toast */}
      <Toast message={message} type={type} />
    </div>
  );
};

export default LoginForm;
