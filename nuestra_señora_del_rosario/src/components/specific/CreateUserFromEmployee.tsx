import React, { useState } from 'react';
import { useCreateUserFromEmployee } from '../../hooks/useCreateUserFromEmployee';
import { useThemeDark } from '../../hooks/useThemeDark';
import Toast from '../common/Toast';
import RoleDropdown from '../microcomponents/RoleDrodown';
import EmployeeDropdown from '../microcomponents/EmployeeDropdown';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const CreateUserFromEmployeeForm: React.FC = () => {
  const { isDarkMode } = useThemeDark();
  const [dniEmployee, setDniEmployee] = useState<number | null>(null);
  const [idRole, setIdRole] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | null>(null);
  const { mutate, isLoading } = useCreateUserFromEmployee();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validaciones
    if (dniEmployee === null || dniEmployee === 0) {
      setToastMessage('Por favor selecciona un empleado');
      setToastType('error');
      return;
    }
    if (idRole === null || idRole === 0) {
      setToastMessage('Por favor selecciona un rol');
      setToastType('error');
      return;
    }

    mutate(
      { dniEmployee, idRole, success: true, message: '' },
      {
        onSuccess: (data) => {
          setToastMessage(data.message || 'Usuario asignado exitosamente');
          setToastType('success');
          setTimeout(() => navigate('/dashboard/usuarios'), 2000);
        },
        onError: (error: any) => {
          setToastMessage(
            error.response?.data?.message || 'Error al asignar usuario'
          );
          setToastType('error');
        }
      }
    );
  };

  const resetForm = () => {
    navigate('/dashboard/usuarios');
  };

  return (
    <div className={`w-full max-w-[600px] mx-auto p-6 rounded-[20px] shadow-2xl ${
      isDarkMode ? 'bg-[#0D313F]' : 'bg-white'
    }`}>
      <h2
        className={`text-3xl font-bold mb-6 text-center ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        Asignar usuario a empleado
      </h2>

      {/* Toast de validación o respuesta */}
      {toastMessage && <Toast message={toastMessage} type={toastType} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            className={`text-lg font-poppins flex items-center mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            Seleccionar empleado
          </label>
          <EmployeeDropdown value={dniEmployee || 0} onChange={setDniEmployee} />
        </div>

        <div>
          <label
            className={`text-lg font-poppins flex items-center mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            Seleccionar rol
          </label>
          <RoleDropdown value={idRole || 0} onChange={setIdRole} />
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <button
            type="submit"
            className={`px-7 py-4 text-white text-lg font-inter rounded-lg shadow-lg transition duration-200 ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : 'Asignar usuario'}
          </button>

          <button
            type="button"
            className="px-7 py-4 bg-red-500 text-white text-lg font-inter rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
            onClick={resetForm}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserFromEmployeeForm;
