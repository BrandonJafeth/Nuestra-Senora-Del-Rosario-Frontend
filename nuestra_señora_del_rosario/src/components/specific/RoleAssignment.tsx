import LoadingSpinner from '../microcomponents/LoadingSpinner';

import { useThemeDark } from '../../hooks/useThemeDark'; // Para modo oscuro
import { useNavigate } from 'react-router-dom';
import { useRoles } from '../../hooks/useRoles';

interface RoleAssignmentProps {
  employeeDni: number; // Recibe la cédula del empleado
  onCancel: () => void; // Callback para cuando se presiona "Cancelar"
}

const RoleAssignment = ({ employeeDni, onCancel }: RoleAssignmentProps) => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeDark(); // Modo oscuro

  // Usar el hook personalizado para manejar la lógica de asignación de roles
  const { roles, isLoadingRoles, isErrorRoles, selectedRole, handleRoleChange, handleSubmit, assignRoleMutation } = useRoles(employeeDni);

  // Mostrar spinner mientras los roles se están cargando
  if (isLoadingRoles) return <LoadingSpinner />;
  // Mostrar mensaje de error si falla la carga de datos
  if (isErrorRoles) return <div>Error al cargar los roles.</div>;

  return (
    <div className={`w-full max-w-[600px] mx-auto p-6 mt-12 ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'} rounded-[20px] shadow-2xl`}>
      <h3 className={`text-2xl font-bold mb-8 text-center font-poppins ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Asignar rol al empleado
      </h3>

      <div className="roles-list space-y-4">
        {roles?.map((role: any) => (
          <div key={role.idRole} className="flex items-center">
            <input
              type="radio"
              id={`role-${role.idRole}`}
              name="role"
              value={role.idRole}
              checked={selectedRole === role.idRole}
              onChange={() => handleRoleChange(role.idRole)}
              className={`mr-2 focus:ring-blue-500 h-4 w-4 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f2f4f7] text-gray-900'}`}
            />
            <label
              htmlFor={`role-${role.idRole}`}
              className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
            >
              {role.nameRole}
            </label>
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-4 mt-8">
        {/* Botón Cancelar */}
        <button
          onClick={onCancel}
          className={`px-7 py-4 bg-red-500 text-white text-lg font-inter rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-red-600`}
        >
          Cancelar
        </button>

        {/* Botón para asignar el rol */}
        <button
          onClick={() => handleSubmit(() => navigate('/dashboard'))}
          disabled={!selectedRole || assignRoleMutation.isLoading}
          className={`px-7 py-4 text-lg font-inter rounded-lg shadow-lg transition-transform transform hover:scale-105 
            ${assignRoleMutation.isLoading ? 'bg-gray-500' : isDarkMode ? 'bg-[#233d63] text-white' : 'bg-[#233d63] text-white'} 
            hover:bg-[#1b2f52]`}
        >
          {assignRoleMutation.isLoading ? 'Asignando...' : 'Asignar Rol'}
        </button>
      </div>
    </div>
  );
};

export default RoleAssignment;
