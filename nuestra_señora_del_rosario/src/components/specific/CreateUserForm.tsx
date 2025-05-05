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
  const { isDarkMode } = useThemeDark(); // Deteción de modo oscuro

  // Estado para datos del formulario
  const [formData, setFormData] = useState({
    dni: '',
    email: '',
    id_Role: 0,
    password: '',
    fullName: '',
    // isActive siempre será true, no se modifica
  });

  const employeeDni = formData.dni;
  const { roles, isLoadingRoles, isErrorRoles } = useRoles(Number(employeeDni));
  const { message, showToast, type } = useToast();
  const { mutate: createUser, isLoading, isError, error } = useCreateUser();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones de formulario
    if (!/^[0-9]+$/.test(formData.dni)) {
      showToast('El DNI debe contener solo números', 'error');
      return;
    }
    if (formData.dni.length < 9 || formData.dni.length > 12) {
      showToast('El DNI debe tener entre 9 y 12 dígitos', 'error');
      return;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.com')) {
      showToast('El correo electrónico debe ser válido', 'error');
      return;
    }
    if (formData.fullName.trim() === '') {
      showToast('El nombre completo es requerido', 'error');
      return;
    }
    if (Number(formData.id_Role) === 0) {
      showToast('Debe seleccionar un rol', 'error');
      return;
    }

    // Envío de solicitud de creación de usuario con isActive siempre true
    createUser(
      {
        id_User: 0,
        id_Role: Number(formData.id_Role),
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
        },
        onError: (err: any) => {
          showToast(err.response?.data?.message || 'Error al crear usuario', 'error');
        },
      }
    );
  };

  useEffect(() => {
    if (isError && error) {
      showToast(error.message || 'Error al crear usuario', 'error');
    }
  }, [isError, error]);

  return (
    <div
      className={`w-full max-w-3xl mx-auto p-10 rounded-xl shadow-xl transition-all duration-300 ${{
        true: 'bg-[#0D313F] text-white',
        false: 'bg-white text-gray-900',
      }[String(isDarkMode)]}`}
    >
      <h2 className="text-3xl font-bold text-center mb-6">
        Registro de usuario
      </h2>

      {message && <Toast message={message} type={type || 'info'} />}

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
            className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${{
              true: 'bg-gray-700 text-white border-gray-600',
              false: 'bg-gray-100 text-gray-900 border-gray-300',
            }[String(isDarkMode)]}`}
            placeholder="Ingrese la cédula"
            required
          />
        </div>

        {/* Correo Electrónico */}
        <div>
          <label htmlFor="email" className="block text-lg font-medium">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${{
              true: 'bg-gray-700 text-white border-gray-600',
              false: 'bg-gray-100 text-gray-900 border-gray-300',
            }[String(isDarkMode)]}`}
            placeholder="Ingrese su correo"
            required
          />
        </div>

        {/* Contraseña generada automáticamente */}
        <div>
          <label htmlFor="password" className="block text-lg font-medium">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            readOnly
            className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition ${{
              true: 'bg-gray-700 text-white border-gray-600 cursor-not-allowed',
              false: 'bg-gray-100 text-gray-900 border-gray-300 cursor-not-allowed',
            }[String(isDarkMode)]}`}
            placeholder="Contraseña generada automáticamente"
          />
          <p className="text-sm font-bold text-gray-500 mt-1">
            La contraseña se generará automáticamente y será enviada al usuario.
          </p>
        </div>

        {/* Nombre Completo */}
        <div>
          <label htmlFor="fullName" className="block text-lg font-medium">
            Nombre completo
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${{
              true: 'bg-gray-700 text-white border-gray-600',
              false: 'bg-gray-100 text-gray-900 border-gray-300',
            }[String(isDarkMode)]}`}
            placeholder="Ingrese su nombre completo"
            required
          />
        </div>

        {/* Estado Activo (fijo) */}
        <div>
          <label htmlFor="isActive" className="block text-lg font-medium">
            Estado
          </label>
          <select
            id="isActive"
            name="isActive"
            value="true"
            disabled
            className={`w-full p-3 rounded-md shadow-sm focus:outline-none transition ${{
              true: 'bg-gray-700 text-white border-gray-600 cursor-not-allowed',
              false: 'bg-gray-100 text-gray-900 border-gray-300 cursor-not-allowed',
            }[String(isDarkMode)]}`}
          >
            <option value="true">Activo</option>
          </select>
          <p className="text-sm font-bold text-gray-500 mt-1">
            El usuario siempre se crea como activo
          </p>
        </div>

        {/* Roles */}
        <div>
          <label htmlFor="id_Role" className="block text-lg font-medium">
            Rol
          </label>
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
              className={`w-full p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${{
                true: 'bg-gray-700 text-white border-gray-600',
                false: 'bg-gray-100 text-gray-900 border-gray-300',
              }[String(isDarkMode)]}`}
            >
              <option value={0} disabled>
                Seleccione un rol
              </option>
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
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 text-white font-semibold rounded-lg shadow-md transition-all ${{
              true: 'bg-blue-400',
              false: 'bg-blue-500 hover:bg-blue-600',
            }[String(isLoading)]}`}
          >
            {isLoading ? <LoadingSpinner /> : 'Agregar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/usuarios')}
            className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
