import React from 'react';
import { useIcon } from "../../hooks/useIcons";
import useToggle from '../../hooks/useToggle';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useThemeDark } from '../../hooks/useThemeDark'; // Importar el hook del modo oscuro

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar = ({ isSidebarOpen }:SidebarProps) => {
  const { isDropdownOpen, toggleDropdown } = useToggle();
  const { getIcon } = useIcon();
  const { logout } = useAuth();
  const { isDarkMode } = useThemeDark(); 

  const menuItems = [
    { name: 'Residentes', link: '/dashboard/residentes' },
    { name: 'Personal', link: '/dashboard/personal' },
    { name: 'Inventario', link: '/dashboard/inventario' },
    { name: 'Cronograma de Citas', link: '/dashboard/cronograma-citas' },
  ];

  return (
    <aside
    className={`fixed left-0 z-40 w-64 h-[calc(100%-64px)] pt-4 transition-transform ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-black'} border-r border-gray-200 dark:border-gray-700 font-poppins`}
    style={{ top: '64px' }}
    aria-label="Sidebar"
  >
    <div className={`h-full flex flex-col justify-between px-3 pb-4 overflow-y-auto ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'}`}>
      
      {/* Parte superior con los enlaces */}
      <ul className="space-y-2 font-medium">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.link}
              className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode ? 'hover:bg-gray-700 dark:text-white' : 'hover:bg-gray-100 text-black'
              }`}
            >
              <span className="flex items-center justify-center w-6 h-6">
                {getIcon(item.name)}
              </span>
              <span className="ml-3">{item.name}</span>
            </Link>
          </li>
        ))}
  
        {/* Dropdown de Solicitudes */}
        <li className="relative">
          <button
            onClick={toggleDropdown}
            className={`flex items-center w-full p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode ? 'hover:bg-gray-700 dark:text-white' : 'hover:bg-gray-100 text-black'
            }`}
          >
            <span className="flex items-center justify-center w-6 h-6">
              {getIcon('Solicitudes')}
            </span>
            <span className="flex-1 ml-3 text-left">Solicitudes</span>
            <svg
              className={`w-5 h-5 transform transition-transform duration-300 ${
                isDropdownOpen ? 'rotate-180' : 'rotate-0'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
  
          {/* Submenú dentro del Dropdown */}
          {isDropdownOpen && (
            <ul className="pl-8 mt-2 space-y-1 py-2">
              <li>
                <Link
                  to="solicitudes/ingreso"
                  className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                    isDarkMode ? 'hover:bg-gray-600 dark:text-white' : 'hover:bg-gray-100 text-black'
                  }`}
                >
                  <span className="flex items-center justify-center w-5 h-5">
                    {getIcon('Ingreso')}
                  </span>
                  <span className="ml-2">Ingreso</span>
                </Link>
              </li>
              <li>
                <Link
                  to="solicitudes/voluntariado"
                  className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                    isDarkMode ? 'hover:bg-gray-600 dark:text-white' : 'hover:bg-gray-100 text-black'
                  }`}
                >
                  <span className="flex items-center justify-center w-5 h-5">
                    {getIcon('Voluntariado')}
                  </span>
                  <span className="ml-2">Voluntariado</span>
                </Link>
              </li>
              <li>
                <Link
                  to="solicitudes/donaciones"
                  className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                    isDarkMode ? 'hover:bg-gray-600 dark:text-white' : 'hover:bg-gray-100 text-black'
                  }`}
                >
                  <span className="flex items-center justify-center w-5 h-5">
                    {getIcon('Donaciones')}
                  </span>
                  <span className="ml-2">Donaciones</span>
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
  
      {/* Botón Cerrar Sesión en la parte inferior */}
      <ul className="space-y-2 font-medium">
        <li className={`flex items-center w-full p-2 rounded-lg transition-colors duration-200 ${
          isDropdownOpen ? 'mt-4' : 'mt-0'
        } ${isDarkMode ? 'hover:bg-gray-700 dark:text-white' : 'hover:bg-gray-100 text-black'}`}>
          <button onClick={logout} className="flex items-center w-full">
            <span className="flex items-center justify-center w-6 h-6">
              {getIcon('Ingreso')}
            </span>
            <span className="ml-3">Cerrar Sesión</span>
          </button>
        </li>
      </ul>
    </div>
  </aside>  
  );
};

export default Sidebar;