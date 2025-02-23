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
  const { payload, selectedRole } = useAuth(); // Obtener el rol seleccionado del contexto
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); 

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleUserSettings = () => {
    navigate('/dashboard/Configuracion-usuario');
    setIsDropdownOpen(false);
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
              <Icon icon="line-md:menu-fold-left" className="w-6 h-6" />
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
              {isDarkMode ? <Icon icon="line-md:sunny-filled-loop" /> : <Icon icon="line-md:moon-filled-alt-loop" />}
            </button>

            <div className="relative flex items-center ms-3">
              <div>
                <button
                  onClick={toggleDropdown}
                  type="button"
                  className="flex text-sm bg-gray-800 dark:bg-gray-700 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                >
                  <span className="sr-only">Open user menu</span>
                  <Icon icon="mdi:account-circle" className="w-8 h-8 bg-gray-200 dark:bg-gray-600 dark:text-white rounded-full p-1" />
                </button>
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 top-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg">
                  <div className="py-2 px-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cedula: {payload?.dni || 'Cédula'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Rol: {selectedRole || 'No seleccionado'}</p>
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
