import Toast from '../common/Toast'; // Componente Toast para mostrar mensajes
import { useEmployeeForm } from '../../hooks/useRegisterEmployee';

function EmployeeForm() {
  const {
    dni, firstName, lastName1, lastName2, phoneNumber, address, email, emergencyPhone,
    handleSubmit, setDni, setFirstName, setLastName1, setLastName2, setPhoneNumber, 
    setAddress, setEmail, setEmergencyPhone, typeOfSalaryId, professionId, getIcon, 
    isDarkMode, message, type, 
  } = useEmployeeForm();

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'} rounded-[20px] shadow-2xl`}>
      <h2 className={`text-3xl font-bold mb-8 text-center font-poppins ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Registro de empleados
      </h2>
      <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
        {/* Columna izquierda */}
        <div className="space-y-6">
          
          {/* Nombre */}
          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Nombre')}
              <span className="ml-2">Nombre</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese su nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          {/* Primer Apellido */}
          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Primer Apellido')}
              <span className="ml-2">Primer Apellido</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese su primer apellido"
              value={lastName1}
              onChange={(e) => setLastName1(e.target.value)}
            />
          </div>

          {/* Segundo Apellido */}
          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Segundo Apellido')}
              <span className="ml-2">Segundo Apellido</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese su segundo apellido"
              value={lastName2}
              onChange={(e) => setLastName2(e.target.value)}
            />
          </div>

          {/* Cédula */}
          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Cédula')}
              <span className="ml-2">Cédula</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese su cédula"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
          </div>

          {/* Correo Electrónico */}
          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Correo Electrónico')}
              <span className="ml-2">Correo Electrónico</span>
            </label>
            <input
              type="email"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese su correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">

          {/* Teléfono */}
          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Teléfono')}
              <span className="ml-2">Teléfono</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese su teléfono"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* Dirección */}
          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Dirección')}
              <span className="ml-2">Dirección</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese su dirección"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Profesión */}
          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Profesión')}
              <span className="ml-2">Profesión</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese su profesión"
              value={professionId} // Valor quemado para profesión
              disabled
            />
          </div>

          {/* Salario */}
          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Salario')}
              <span className="ml-2">Salario</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese su salario"
              value={typeOfSalaryId} // Valor quemado para salario
              disabled
            />
          </div>

          {/* Contacto de Emergencia */}
          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {getIcon('Contacto de Emergencia')}
              <span className="ml-2">Contacto de Emergencia</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              placeholder="Ingrese el contacto de emergencia"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
            />
          </div>
        </div>
      </form>

      {/* Botones de Acción */}
      <div className="flex justify-center space-x-4 mt-8">
        <button
          onClick={handleSubmit}
          type="submit"
          className="px-7 py-4 bg-[#233d63] text-white text-lg font-inter rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-[#1b2f52]"
        >
          Agregar
        </button>
        <button
          type="button"
          className="px-7 py-4 bg-[#c62b2b] text-white text-lg font-inter rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-[#a52222]"
        >
          Cancelar
        </button>
      </div>

     
      <Toast message={message} type={type} />
    </div>
  );
}

export default EmployeeForm;
