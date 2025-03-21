import { useThemeDark } from '../hooks/useThemeDark';
import RequestPasswordForm from '../components/specific/RequestPasswordForm';
import { Icon } from '@iconify/react/dist/iconify.js';

function RequestPassword() {
  const { isDarkMode, toggleDarkMode } = useThemeDark();

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-gray-900' : 'bg-[#f2f4f7]'}`}>
      {/* Botón para alternar entre modo oscuro y claro */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 transition"
      >
        {isDarkMode ? (
                <Icon icon="line-md:sunny-filled-loop" />
              ) : (
                <Icon icon="line-md:moon-filled-alt-loop" />
              )}
      </button>
      
      {/* Contenedor del formulario con sombra */}
      {/* Contenedor del formulario con sombra */ }
<div className="relative w-full max-w-md p-8 bg-white text-gray-900 rounded-lg shadow-2xl dark:bg-gray-800 dark:text-white">
  <RequestPasswordForm />
</div>
    </div>
  );
}

export default RequestPassword;
