import { useState } from 'react';
import Toast from '../common/Toast';
import { useEmployeeForm } from '../../hooks/useRegisterEmployee';
import { useTypeSalary } from '../../hooks/useTypeSalary';
import { useProfession } from '../../hooks/useProfession';
import RoleAssignment from './RoleAssignment'; // Componente de asignación de roles
import { useToast } from '../../hooks/useToast';

function EmployeeForm() {
  const [isEmployeeRegistered, setIsEmployeeRegistered] = useState(false); // Estado para alternar entre formulario y asignación de rol
  const [employeeDni, setEmployeeDni] = useState<number | null>(null); // Almacenar el DNI del empleado registrado

  // Obtener valores y funciones del hook personalizado `useEmployeeForm`
  const {
    dni, firstName, lastName1, lastName2, phoneNumber, address, email, emergencyPhone,
    handleSubmit, setDni, setFirstName, setLastName1, setLastName2, setPhoneNumber, 
    setAddress, setEmail, setEmergencyPhone, setProfession, 
    isDarkMode, message, type, setTypeOfSalaryId
  } = useEmployeeForm();

  const { data: typeSalaryData } = useTypeSalary(); // Hook para obtener tipos de salario
  const { data: professionData } = useProfession(); // Hook para obtener profesiones

  const { showToast } = useToast(); // Hook de Toast para mostrar mensajes

  // Manejador del envío del formulario
  const handleFormSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const success = await handleSubmit(e); // Verificar si el registro fue exitoso
    
    if (success) {
      setEmployeeDni(parseInt(dni)); // Almacenar el DNI si el registro fue exitoso
      setIsEmployeeRegistered(true); // Mostrar el componente de asignación de roles
      showToast('Empleado registrado exitosamente. Asigna un rol.', 'success');
    }
  };

  // Callback cuando se completa o cancela la asignación de rol
  const handleRoleAssignmentComplete = () => {
    // Volver a mostrar el formulario de empleados
    setIsEmployeeRegistered(false);
  };

  if (isEmployeeRegistered && employeeDni !== null) {
    // Si el empleado está registrado y tenemos un DNI, mostrar el componente de asignación de roles
    return <RoleAssignment employeeDni={employeeDni} onCancel={handleRoleAssignmentComplete} />
  }
  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'} rounded-[20px] shadow-2xl`}>
      <h2 className={`text-3xl font-bold mb-8 text-center font-poppins ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Registro de empleados
      </h2>

      {/* Formulario con sus inputs */}
      <form className="grid grid-cols-2 gap-6" onSubmit={handleFormSubmit}>
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
              <span className="ml-2">Puesto</span>
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

          {/* Tipo de Salario */}
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
        <button
          type="button"
          className="px-7 py-4 bg-red-500 text-white text-lg font-inter rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
          tabIndex={1}
        >
          Cancelar
        </button>
        <button
          onClick={handleFormSubmit} // Llama al manejador de envío
          type="submit"
          className="px-7 py-4 bg-blue-500 text-white text-lg font-inter rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
          tabIndex={0}
        >
          Agregar
        </button>
      </div>

      <Toast message={message} type={type} />
    </div>
  );
}

export default EmployeeForm;
