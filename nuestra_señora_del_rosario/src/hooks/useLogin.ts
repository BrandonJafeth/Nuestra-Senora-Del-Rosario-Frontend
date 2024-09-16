import { useState } from 'react';
import { decodeTokenRole } from '../utils/decodedToken';
import userService from '../services/UserService';
import { useToast } from './useToast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const useLogin = () => {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga
  const { showToast, message, type } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (cedula && password) {
      setIsLoading(true); // Mostrar loading
      try {
        const response = await userService.createUser({
          dniEmployee: parseInt(cedula),
          password,
        });

        const token = response.data?.token;

        if (token) {
          console.log('Token recibido:', token);
          login(token);

          const userRole = decodeTokenRole(token);
          showToast('Inicio de sesión exitoso', 'success');

          if (userRole === 'Admin') {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        } else {
          showToast('Error: No se recibió el token.', 'error');
        }
      } catch (error) {
        console.error('Error iniciando sesión:', error);
        showToast('Credenciales Incorrectas. Por favor, intente nuevamente.', 'error');
      } finally {
        setIsLoading(false); // Ocultar loading
      }
    } else {
      showToast('Por favor ingrese su cédula y contraseña', 'error');
    }
  };

  return {
    handleLogin,
    message,
    type,
    cedula,
    setCedula,
    password,
    setPassword,
    isLoading // Devolvemos el estado de carga
  };
};

export default useLogin;
