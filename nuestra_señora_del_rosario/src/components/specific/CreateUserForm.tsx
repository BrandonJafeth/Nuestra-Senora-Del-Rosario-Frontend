import React, { useState, useEffect } from 'react';
import { useCreateUser } from '../../hooks/useCreateUser';
import { useNavigate } from 'react-router-dom';
import { useThemeDark } from '../../hooks/useThemeDark';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import Toast from '../common/Toast';
import { useRoles } from '../../hooks/useRoles';
import { useToast } from '../../hooks/useToast';

const CreateUserForm: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeDark();
  const { message, showToast, type } = useToast();

  const [formData, setFormData] = useState({
    dni: '',
    email: '',
    id_Role: 0,
    password: '',
    fullName: '',
  });

  const { roles, isLoadingRoles, isErrorRoles } = useRoles(Number(formData.dni));
  const { mutate: createUser, isLoading, isError, error } = useCreateUser();  // Función de envío simplificada - deja que el backend maneje la validación de duplicados
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas de frontend
    if (!formData.dni.trim() || !/^\d+$/.test(formData.dni) || formData.dni.length < 9 || formData.dni.length > 12) {
      showToast('La cédula debe contener solo números y tener entre 9 y 12 dígitos', 'error');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@') || !formData.email.includes('.com')) {
      showToast('Ingrese un correo electrónico válido', 'error');
      return;
    }
    if (formData.email.length > 50) {
      showToast('El correo electrónico no puede exceder los 50 caracteres', 'error');
      return;
    }

    if (!formData.fullName.trim()) {
      showToast('El nombre completo es requerido', 'error');
      return;
    }
    if (formData.fullName.length < 3) {
      showToast('El nombre completo debe tener al menos 3 caracteres', 'error');
      return;
    }    if (formData.fullName.length > 50) {
      showToast('El nombre completo no puede exceder los 50 caracteres', 'error');
      return;
    }
    if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(formData.fullName)) {
      showToast('El nombre completo solo puede contener letras (con o sin tildes) y espacios', 'error');
      return;
    }

    if (formData.id_Role === 0) {
      showToast('Debe seleccionar un rol', 'error');
      return;
    }

    // Crear usuario - el backend manejará validaciones de duplicados específicas
    createUser(
      {
        id_User: 0,
        id_Role: formData.id_Role,
        roles: [],
        dni: Number(formData.dni),
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        is_Active: true,
        isActive: false,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      {
        onSuccess: () => {
          showToast('Usuario creado con éxito', 'success');
          setTimeout(() => navigate('/dashboard/usuarios'), 1000);
        },        onError: (err: unknown) => {
          console.error('Error creating user:', err);
          
          // Manejo más robusto de errores de axios
          let errorMessage = 'Error al crear usuario';
          
          if (err && typeof err === 'object') {
            const axiosError = err as {
              response?: {
                data?: {
                  message?: string;
                  error?: string;
                } | string;
                status?: number;
              };
              message?: string;
            };
            
            // Verificar si es un error de axios con response
            if (axiosError.response?.data) {
              // Si data es un objeto con message
              if (typeof axiosError.response.data === 'object' && axiosError.response.data.message) {
                errorMessage = axiosError.response.data.message;
              }
              // Si data es un objeto con error
              else if (typeof axiosError.response.data === 'object' && axiosError.response.data.error) {
                errorMessage = axiosError.response.data.error;
              }
              // Si data es un string
              else if (typeof axiosError.response.data === 'string') {
                errorMessage = axiosError.response.data;
              }
              // Si es un error 500, mostrar mensaje específico
              else if (axiosError.response.status === 500) {
                errorMessage = 'Error interno del servidor. Por favor, intente nuevamente.';
              }
            }
            // Si no hay response, verificar si hay mensaje en el error principal
            else if (axiosError.message) {
              errorMessage = axiosError.message;
            }
          }
          
          showToast(errorMessage, 'error');
        },
      }
    );
  };  // Capturar errores de la mutación como backup
  useEffect(() => {
    if (isError && error) {
      console.error('Mutation error in useEffect:', error);
      
      let errorMessage = 'Error al crear usuario';
      
      // Si el error tiene un mensaje, usarlo
      if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    }
  }, [isError, error, showToast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`w-full max-w-3xl mx-auto p-10 rounded-xl shadow-xl transition-all duration-300 ${
      isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-900'
    }`}>
      <h2 className="text-3xl font-bold text-center mb-6">Registro de usuario</h2>

      {/* Toast global */}
      {message && <Toast message={message} type={type || 'info'} />}

      <form onSubmit={handleFormSubmit} noValidate className="grid grid-cols-2 gap-6">        {/* DNI */}
        <div>
          <label htmlFor="dni" className="block text-lg font-medium">DNI</label>
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
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-lg font-medium">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'
            }`}
            placeholder="example@correo.com"
          />
        </div>

        {/* Password (readonly) */}
        <div>
          <label htmlFor="password" className="block text-lg font-medium">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            readOnly
            className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition ${
              isDarkMode ? 'bg-gray-700 text-white border-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-900 border-gray-300 cursor-not-allowed'
            }`}
            placeholder="Se genera automáticamente"
          />
          <p className="text-sm font-bold text-gray-500 mt-1">
            Se generará automáticamente y se enviará al usuario.
          </p>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-lg font-medium">Nombre completo</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'
            }`}
            placeholder="Nombre y apellidos"
          />
        </div>

        {/* Estado fijo */}
        <div>
          <label htmlFor="isActive" className="block text-lg font-medium">Estado</label>
          <select
            id="isActive"
            name="isActive"
            value="true"
            disabled
            className={`w-full p-3 rounded-md shadow-sm focus:outline-none transition ${
              isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'
            }`}
          >
            <option value="true">Activo</option>
          </select>
          <p className="text-sm font-bold text-gray-500 mt-1">
            El usuario siempre se crea como activo.
          </p>
        </div>

        {/* Roles */}
        <div>
          <label htmlFor="id_Role" className="block text-lg font-medium">Rol</label>
          {isLoadingRoles ? (
            <p>Cargando roles...</p>
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
              <option value={0}>Seleccione un rol</option>
              {roles?.map((r) => (
                <option key={r.idRole} value={r.idRole}>{r.nameRole}</option>
              ))}
            </select>
          )}
        </div>        {/* Botones */}
        <div className="col-span-2 flex justify-center gap-6 mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 text-white font-semibold rounded-lg shadow-md transition ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? <LoadingSpinner /> : 'Agregar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/usuarios')}
            className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
