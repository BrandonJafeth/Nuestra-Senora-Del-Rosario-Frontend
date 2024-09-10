import { useIcon } from '../../hooks/useIcons'; // Importa el hook para los iconos
import { useThemeDark } from '../../hooks/useThemeDark'; // Usa el hook para obtener el modo oscuro

function EmployeeForm() {
  const { getIcon } = useIcon(); // Usa el hook para obtener los iconos
  const { isDarkMode } = useThemeDark(); // Usa el hook para obtener el modo oscuro

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'} rounded-[20px] shadow-2xl`}>
      <h2 className={`text-3xl font-bold mb-8 text-center font-poppins ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Registro de empleados
      </h2>
      <form className="grid grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div className="space-y-6">
          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Nombre')} {/* Icono para Nombre */}
              <span className="ml-2">Nombre</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese su nombre"
            />
          </div>

          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Segundo Apellido')} {/* Icono para Segundo Apellido */}
              <span className="ml-2">Segundo Apellido</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese su segundo apellido"
            />
          </div>

          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Profesión')} {/* Icono para Profesión */}
              <span className="ml-2">Profesión</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese su profesión"
            />
          </div>

          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Teléfono')} {/* Icono para Teléfono */}
              <span className="ml-2">Teléfono</span>
            </label>
            <input
              type="tel"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese su teléfono"
            />
          </div>

          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Dirección')} {/* Icono para Dirección */}
              <span className="ml-2">Dirección</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese su dirección"
            />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Primer Apellido')} {/* Icono para Primer Apellido */}
              <span className="ml-2">Primer Apellido</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese su primer apellido"
            />
          </div>

          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Cédula')} {/* Icono para Cédula */}
              <span className="ml-2">Cédula</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese su cédula"
            />
          </div>

          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Correo Electrónico')} {/* Icono para Correo Electrónico */}
              <span className="ml-2">Correo Electrónico</span>
            </label>
            <input
              type="email"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese su correo"
            />
          </div>

          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Salario')} {/* Icono para Salario */}
              <span className="ml-2">Salario</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese su salario"
            />
          </div>

          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Contacto de Emergencia')} {/* Icono para Contacto de Emergencia */}
              <span className="ml-2">Contacto de Emergencia</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese el contacto de emergencia"
            />
          </div>
        </div>
      </form>

      {/* Botones de Acción */}
      <div className="flex justify-center space-x-4 mt-8">
        <button className="px-7 py-4 bg-[#233d63] text-white text-lg font-inter rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-[#1b2f52]">
          Agregar
        </button>
        <button className="px-7 py-4 bg-[#c62b2b] text-white text-lg font-inter rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-[#a52222]">
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default EmployeeForm;