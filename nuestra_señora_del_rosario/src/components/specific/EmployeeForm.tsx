import Toast from '../common/Toast'; // Componente Toast para mostrar mensajes
import { useEmployeeForm } from '../../hooks/useRegisterEmployee';
import { useTypeSalary } from '../../hooks/useTypeSalary';
import { useProfession } from '../../hooks/useProfession';

function EmployeeForm() {

  const {
    dni, firstName, lastName1, lastName2, phoneNumber, address, email, emergencyPhone,
    handleSubmit, setDni, setFirstName, setLastName1, setLastName2, setPhoneNumber, 
    setAddress, setEmail, setEmergencyPhone, setProfession, getIcon, 
    isDarkMode, message, type, setTypeOfSalaryId} = useEmployeeForm();

    const {data: typeSalaryData} = useTypeSalary();
    const {data: professionData} = useProfession();

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'} rounded-[20px] shadow-2xl`}>
      <h2 className={`text-3xl font-bold mb-8 text-center font-poppins ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Registro de empleados
      </h2>

      {/* Formulario con sus inputs */}
      <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
        {/* Columna izquierda */}
        <div className="space-y-6">

          {/* Nombre */}
          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
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

          {/* Cedula */}
          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>

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
    
              <span className="ml-2">Profesión</span>
            </label>
            <select
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              onChange={(e) => setProfession(parseInt(e.target.value))}
            >
              {professionData?.map((type: any) => (
                <option key={type.id_Profession} value={type.id_Profession}>
                  {type.name_Profession}
                </option>
              ))}
            </select>
          </div>
           <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
             
              <span className="ml-2">Tipo de Salario</span>
            </label>
            <select
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
              onChange={(e) => setTypeOfSalaryId(parseInt(e.target.value))}
            >
              {typeSalaryData?.map((type: any) => (
                <option key={type.id_TypeOfSalary} value={type.id_TypeOfSalary}>
                  {type.name_TypeOfSalary}
                </option>
              ))}
            </select>
          </div>

          {/* Contacto de Emergencia */}
          <div>
            <label className={`text-lg font-poppins flex items-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
           
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
  {/* Botón Agregar primero en el DOM para que se tabule primero */}
  <button
    type="button"
    className="px-7 py-4 bg-[#c62b2b] text-white text-lg font-inter rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-[#a52222]"
    tabIndex={1}  // Sin tabIndex o con tabIndex=0 sigue el flujo natural
  >
    Cancelar
  </button>
  <button
    type="submit"
    className="px-7 py-4 bg-[#233d63] text-white text-lg font-inter rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-[#1b2f52]"
    tabIndex={0}  // Sin tabIndex o con tabIndex=0 sigue el flujo natural
  >
    Agregar
  </button>

  {/* Botón Cancelar después en el DOM pero visualmente a la izquierda */}
</div>



      <Toast message={message} type={type} />
    </div>
  );
}

export default EmployeeForm;
