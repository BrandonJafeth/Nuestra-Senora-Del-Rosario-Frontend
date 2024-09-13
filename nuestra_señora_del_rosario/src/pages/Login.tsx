import LoginForm from '../components/specific/LoginForm';
import { useThemeDark } from '../hooks/useThemeDark'; // Hook para usar el ThemeContext

const Login = () => {
  const { isDarkMode, toggleDarkMode } = useThemeDark(); // Obtener el estado del modo oscuro y la función para alternar

  return (
    <div className={`flex h-screen transition-colors duration-500 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Sección del logo */}
      <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <img
          className="w-1/2 max-w-md"
          src="https://i.ibb.co/D5xXgD5/Icon-whitout-fondo.png"
          alt="Logo de la Casa Hogar"
        />
      </div>

      {/* Sección del formulario de inicio de sesión */}
      <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-l-[100px]`}>
        <LoginForm />
      </div>

      {/* Botón para alternar entre modo oscuro y claro */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 transition"
      >
        {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
      </button>
    </div>
  );
};

export default Login;
