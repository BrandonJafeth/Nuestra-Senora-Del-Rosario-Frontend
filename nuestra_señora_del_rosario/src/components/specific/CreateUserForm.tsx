import React, { useState, useEffect } from 'react';
import { useCreateUser } from '../../hooks/useCreateUser';
import { useNavigate } from 'react-router-dom';
import { useThemeDark } from '../../hooks/useThemeDark';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import Toast from '../common/Toast';
import { useRoles } from '../../hooks/useRoles';

const CreateUserForm: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeDark(); // Hook para detectar el modo oscuro

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    dni: '',
    email: '',
    id_Role: 0,
    password: '',
    fullName: '', // 📌 Nuevo campo para el nombre completo
    isActive: true,
  });

  const employeeDni = formData.dni; // Assuming you want to use the dni from formData
  const { roles, isLoadingRoles, isErrorRoles } = useRoles(Number(employeeDni)); // 📌 Obtenemos los roles
  

  // Estado para mensajes de Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | null>(null);

  // Hook de creación de usuario
  const { mutate: createUser, isLoading, isError, error } = useCreateUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'isActive' ? value === 'true' : value, // Convierte 'isActive' a booleano
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser(
      {
        id_User: 0,
        id_Role: Number(formData.id_Role),
        roles: [],
        dni: Number(formData.dni),
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName, // 📌 Agregando fullName a la solicitud
        is_Active: formData.isActive,
        isActive: false,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      {
        onSuccess: () => {
          setToastMessage('Usuario creado con éxito');
          setToastType('success');

          setTimeout(() => {
            navigate('/dashboard/usuarios'); // Redirige después de 3 segundos
          }, 3000);
        },
        onError: (err: any) => {
          setToastMessage(err.response?.data?.message || 'Error al crear usuario');
          setToastType('error');
        },
      }
    );
  };

  useEffect(() => {
    if (isError && error) {
      setToastMessage(error.message || 'Error al crear usuario');
      setToastType('error');
    }
  }, [isError, error]);

  return (
    <div
      className={`w-full max-w-3xl mx-auto p-10 rounded-xl shadow-xl transition-all duration-300 ${
        isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-900'
      }`}
    >
      <h2 className="text-3xl font-bold text-center mb-6">Registro de Usuario</h2>

      {/* Mostrar el Toast */}
      {toastMessage && <Toast message={toastMessage} type={toastType || 'error'} />}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* DNI */}
        <div>
          <label htmlFor="dni" className="block text-lg font-medium">
            DNI
          </label>
          <input
            type="text"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'
            }`}
            placeholder="Ingrese la cédula"
            required
          />
        </div>

        {/* Correo Electrónico */}
        <div>
          <label htmlFor="email" className="block text-lg font-medium">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'
            }`}
            placeholder="Ingrese su correo"
            required
          />
        </div>

        {/* Contraseña */}
        <div>
  <label htmlFor="password" className="block text-lg font-medium">
    Contraseña
  </label>
  <input
    type="password"
    id="password"
    name="password"
    value={formData.password}
    readOnly // 📌 Hace que el input no sea editable
    className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition ${
      isDarkMode ? 'bg-gray-700 text-white border-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-900 border-gray-300 cursor-not-allowed'
    }`}
    placeholder="Contraseña generada automáticamente"
  />
  <p className="text-sm font-bold text-gray-500 mt-1">
    La contraseña se generará automáticamente y será enviada al usuario.
  </p>
</div>
        {/* 📌 Nombre Completo */}
        <div>
          <label htmlFor="fullName" className="block text-lg font-medium">
            Nombre de Usuario
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'
            }`}
            placeholder="Ingrese su nombre completo"
            required
          />
        </div>

        {/* Estado Activo */}
        <div>
          <label htmlFor="isActive" className="block text-lg font-medium">
            Estado
          </label>
          <select
            id="isActive"
            name="isActive"
            value={String(formData.isActive)}
            onChange={handleChange}
            className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'
            }`}
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>

        <div>
          <label htmlFor="id_Role" className="block text-lg font-medium">Rol</label>
          {isLoadingRoles ? (
            <p className="text-gray-500">Cargando roles...</p>
          ) : isErrorRoles ? (
            <p className="text-red-500">Error al cargar roles</p>
          ) : (
            <select
              id="id_Role"
              name="id_Role"
              value={formData.id_Role}
              onChange={handleChange}
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'
              }`}
            >
              <option value={0} disabled>Seleccione un rol</option>
              {roles?.map((role) => (
                <option key={role.idRole} value={role.idRole}>
                  {role.nameRole}
                </option>
              ))}
            </select>
          )}
        </div>


        {/* Botones */}
        <div className="col-span-2 flex justify-center gap-6 mt-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard/usuarios')}
            className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 text-white font-semibold rounded-lg shadow-md transition-all ${
              isLoading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? <LoadingSpinner /> : 'Agregar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
