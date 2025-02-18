import { useState } from 'react';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useAuth } from '../../hooks/useAuth';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { isDarkMode, toggleDarkMode } = useThemeDark();
  const { payload } = useAuth(); // Obtener los datos del usuario del contexto de autenticación
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Hook para redirección

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleUserSettings = () => {
    navigate('/dashboard/Configuracion-usuario'); // Redirige a la configuración del usuario
    setIsDropdownOpen(false); // Cierra el dropdown
  };

  return (
    <nav className={`fixed top-0 z-50 w-full bg-white dark:bg-[#0D313F] border-b border-gray-200 dark:border-gray-700`}>
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center p-2 text-sm text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                />
              </svg>
            </button>
            <a href="#" className="flex ms-2 md:me-24">
              <img
                src="https://i.ibb.co/TwbrSPf/Icon-whitout-fondo.png"
                className="h-10 me-3"
                alt="Logo"
              />
              <span className="self-center text-xl font-normal font-'Poppins' sm:text-2xl whitespace-nowrap dark:text-white">
                Nuestra Señora del Rosario
              </span>
            </a>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-colors duration-300"
            >
              {isDarkMode ? (
                <Icon icon="line-md:sunny-filled-loop" />
              ) : (
                <Icon icon="line-md:moon-filled-alt-loop" />
              )}
            </button>

            {/* Imagen de usuario */}
            <div className="relative flex items-center ms-3">
              <div>
                <button
                  onClick={toggleDropdown}
                  type="button"
                  className="flex text-sm bg-gray-800 dark:bg-gray-700 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open user menu</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-8 h-8 bg-gray-200 dark:bg-gray-600 dark:text-white rounded-full p-1"
                  >
                    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </button>
              </div>

              {/* Dropdown para mostrar la información del usuario */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg">
                  <div className="py-2 px-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Cedula: {payload?.dni || 'Cédula'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Rol: {payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'Rol'}
                    </p>
                  </div>
                  <div className="border-t border-gray-300 dark:border-gray-600"></div>
                  <button
                    onClick={handleUserSettings}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    ⚙️ Configuración
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
