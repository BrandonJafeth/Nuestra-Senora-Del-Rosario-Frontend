import React, { useState } from 'react';
import { useCreateUser } from '../../hooks/useCreateUser';
import { useNavigate } from 'react-router-dom';
import { useThemeDark } from '../../hooks/useThemeDark';
import LoadingSpinner from '../microcomponents/LoadingSpinner';

const CreateUserForm: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeDark(); // Hook para detectar el modo oscuro

  const [formData, setFormData] = useState({
    dni: '',
    email: '',
    password: '',
    isActive: true,
  });

  const { mutate: createUser, isLoading, isError, isSuccess, error, data } = useCreateUser();

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
        roles: [],
        dni: Number(formData.dni),
        email: formData.email,
        password: formData.password,
        is_Active: formData.isActive,
      },
      {
        onSuccess: () => {
          alert('Usuario creado exitosamente');
          navigate('/dashboard/usuarios'); // Redirige a la lista de usuarios
        },
      }
    );
  };

  return (
    <div className={`w-full max-w-3xl mx-auto p-10 rounded-xl shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-900'}`}>
      <h2 className="text-3xl font-bold text-center mb-6">Registro de Usuario</h2>

      {isSuccess && <p className="text-green-400 text-center">Usuario creado con éxito: {data?.email}</p>}
      {isError && <p className="text-red-400 text-center">Error: {error?.message}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* DNI */}
        <div>
          <label htmlFor="dni" className="block text-lg font-medium">DNI</label>
          <input
            type="text"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
            placeholder="Ingrese la cédula"
            required
          />
        </div>

        {/* Correo Electrónico */}
        <div>
          <label htmlFor="email" className="block text-lg font-medium">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
            placeholder="Ingrese su correo"
            required
          />
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-lg font-medium">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
            placeholder="Ingrese una contraseña"
            required
          />
        </div>

        {/* Estado Activo */}
        <div>
          <label htmlFor="isActive" className="block text-lg font-medium">Estado</label>
          <select
            id="isActive"
            name="isActive"
            value={String(formData.isActive)}
            onChange={handleChange}
            className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
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
