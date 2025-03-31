import Toast from '../common/Toast';
import { useEmployeeForm } from '../../hooks/useRegisterEmployee';
import { useTypeSalary } from '../../hooks/useTypeSalary';
import { useProfession } from '../../hooks/useProfession';
import { useToast } from '../../hooks/useToast';

function EmployeeForm() {

  // Obtener valores y funciones del hook personalizado `useEmployeeForm`
  const {
    dni, firstName, lastName1, lastName2, phoneNumber, address, email, emergencyPhone, id_Profession, id_TypeOfSalary,
    handleSubmit, setDni, setFirstName, setLastName1, setLastName2, setPhoneNumber, 
    setAddress, setEmail, setEmergencyPhone, setProfession, 
    isDarkMode, setTypeOfSalaryId
  } = useEmployeeForm();

  const { data: typeSalaryData } = useTypeSalary(); // Hook para obtener tipos de salario
  const { data: professionData } = useProfession(); // Hook para obtener profesiones

  const { showToast, message, type } = useToast();

  // Manejador del envío del formulario
  const handleFormSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
     if (!firstName.trim()) {
      showToast('El nombre es requerido', 'error');
      return;
    }
    if (!lastName1.trim()) {
      showToast('El primer apellido es requerido', 'error');
      return;
    }
    if ((!dni.trim() || (dni.length < 9 || dni.length > 12) || !/^\d+$/.test(dni))) {
      showToast('La cédula debe contener solo numeros entre 9 y 12 dígitos', 'error');
      return;
    }
    if (!lastName2.trim()) {
      showToast('El segundo apellido es requerido', 'error');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.com')) {
      showToast('Ingrese un correo electrónico válido', 'error');
      return;
    }
    if ((!phoneNumber.trim()) || (phoneNumber.length !== 8) || (!/^\d+$/.test(phoneNumber))) {
      showToast('El teléfono debe contener solo números y ser de 8 digitos', 'error');
      return;
    }
    if (!address.trim()) {
      showToast('La dirección es requerida', 'error');
      return;
    }
    if (id_Profession === 0) {
      showToast('Seleccione una profesión', 'error');
      return;
    }

    // Validar que se haya seleccionado un tipo de salario
    if (id_TypeOfSalary === 0) {
      showToast('Seleccione un tipo de salario', 'error');
      return;
    }
    if ((!emergencyPhone.trim()) || (emergencyPhone.length !== 8) || (!/^\d+$/.test(emergencyPhone))) {
      showToast('El contacto de emergencia debe contener solo números y ser de 8 digitos', 'error');
      return;
    }
    
    const success = await handleSubmit(e); // Verificar si el registro fue exitoso
    
    if (success) {
      showToast('Empleado registrado exitosamente', 'success');
    }
  };

  const handlecancel = () => {
setDni('');
setFirstName('');
setLastName1('');
setLastName2('');
setPhoneNumber('');
setAddress('');
setEmail('');
setEmergencyPhone('');
setProfession(0);
setTypeOfSalaryId(0);
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
              <option value={0}>Seleccione una profesión</option>
              {/* Mapeo de profesiones para llenar el select */}
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
              <option value={0}>Seleccione un tipo de salario</option>
              {/* Mapeo de tipos de salario para llenar el select */}
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
          onClick={handleFormSubmit} // Llama al manejador de envío
          type="submit"
          className="px-7 py-4 bg-blue-500 text-white text-lg font-inter rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
          tabIndex={0}
        >
          Agregar
        </button>
        <button
          type="button"
          onClick={handlecancel}
          className="px-7 py-4 bg-red-500 text-white text-lg font-inter rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
          tabIndex={1}
        >
          Cancelar
        </button>
      </div>

      <Toast message={message} type={type} />
    </div>
  );
}

export default EmployeeForm;
