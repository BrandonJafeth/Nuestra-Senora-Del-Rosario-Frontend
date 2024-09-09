import React from 'react';
import { useIcon } from "../../hooks/useIcons";    // Importar el hook de los íconos
import useToggle from '../../hooks/useToggle';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isSidebarOpen: boolean;
}

// Implementar el componente Sidebar
const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  const { isDropdownOpen, toggleDropdown } = useToggle(); // Usar el hook del dropdown
  const { getIcon } = useIcon(); // Usar el hook de íconos
  const { logout } = useAuth(); // Usar el hook para cerrar sesión

  const menuItems = [
    { name: 'Residentes', link: '/residentes' },
    { name: 'Personal', link: '/personal' },
    { name: 'Inventario', link: '/inventario' },
    { name: 'Cronograma de Citas', link: '/cronograma-citas' },
  ];

  return (
    <aside
      className={`fixed left-0 z-40 w-64 h-[calc(100%-64px)] pt-4 transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } bg-[#0D313F] border-r border-gray-200 dark:border-gray-700 font-poppins`}  // Aplicar la fuente Poppins aquí
      style={{ top: '64px' }}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-[#0D313F]">
        <ul className="space-y-2 font-medium">
          {/* Renderizar los elementos del menú */}
          {menuItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.link}
                className="flex items-center p-2 text-white rounded-lg hover:bg-gray-100 hover:text-whitte dark:hover:bg-gray-700 dark:text-white transition-colors duration-200"
              >
                <span className="flex items-center justify-center w-6 h-6">
                  {getIcon(item.name)}
                </span>
                <span className="ml-3">{item.name}</span>
              </a>
            </li>
          ))}

          {/* Dropdown de Solicitudes */}
          <li className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center w-full p-2 text-white rounded-lg hover:bg-gray-100 hover:text-whitte dark:hover:bg-gray-700 group transition-colors duration-200"
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
                  <a
                    href="/solicitudes/ingreso"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 hover:text-whitte dark:hover:bg-gray-600 dark:hover:text-white rounded-lg transition-colors duration-200"
                  >
                    <span className="flex items-center justify-center w-5 h-5">
                      {getIcon('Ingreso')}
                    </span>
                    <span className="ml-2">Ingreso</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/solicitudes/voluntariado"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 hover:text-whitte dark:hover:bg-gray-600 dark:hover:text-white rounded-lg transition-colors duration-200"
                  >
                    <span className="flex items-center justify-center w-5 h-5">
                      {getIcon('Voluntariado')}
                    </span>
                    <span className="ml-2">Voluntariado</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/solicitudes/donaciones"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 hover:text-whitte dark:hover:bg-gray-600 dark:hover:text-white rounded-lg transition-colors duration-200"
                  >
                    <span className="flex items-center justify-center w-5 h-5">
                      {getIcon('Donaciones')}
                    </span>
                    <span className="ml-2">Donaciones</span>
                  </a>
                </li>
              </ul>
            )}
          </li>

          {/* Cerrar Sesión */}
          <li
            className={`flex items-center w-full p-2 text-white rounded-lg hover:bg-gray-100 hover:text-whitte dark:hover:bg-gray-700 transition-colors duration-200 ${
              isDropdownOpen ? 'mt-4' : 'mt-0'
            }`}
          >
            <button onClick={logout} className="flex items-center w-full">
              <span className="flex items-center justify-center w-6 h-6">
                {getIcon('Cerrar Sesión')}
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
