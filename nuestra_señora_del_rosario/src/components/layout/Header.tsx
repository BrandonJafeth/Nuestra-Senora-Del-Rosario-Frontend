import React from 'react';
import { useThemeDark } from '../../hooks/useThemeDark';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { isDarkMode, toggleDarkMode } = useThemeDark();

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
                alt="FlowBite Logo"
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
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Icono de luna */}
                  <path
                    d="M17.293 13.293a8 8 0 01-11.32-11.32 8 8 0 1011.32 11.32z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Icono de sol */}
                  <path
                    d="M10 2a8 8 0 010 16 8 8 0 010-16zm0 12a1 1 0 102 0V8a1 1 0 10-2 0v6zm0-8a1 1 0 102 0 1 1 0 00-2 0z"
                  />
                </svg>
              )}
            </button>

            {/* Imagen de usuario */}
            <div className="flex items-center ms-3">
              <div>
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 dark:bg-gray-700 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="user photo"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
