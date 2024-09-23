
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import { useThemeDark } from '../../hooks/useThemeDark'; // Para modo oscuro
import { useNavigate } from 'react-router-dom';
import { useRoles } from '../../hooks/useRoles';
import { useToast } from '../../hooks/useToast'; // Importa el hook de Toast
import Toast from '../common/Toast'; // Asegúrate de importar correctamente el componente de Toast

interface RoleAssignmentProps {
  employeeDni: number; // Recibe la cédula del empleado
  onCancel: () => void; // Callback para cuando se presiona "Cancelar"
}

const RoleAssignment = ({ employeeDni, onCancel }: RoleAssignmentProps) => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeDark(); // Modo oscuro
  const { showToast, message, type } = useToast(); // Hook de Toast para mostrar mensajes

  // Usar el hook personalizado para manejar la lógica de asignación de roles
  const { roles, isLoadingRoles, isErrorRoles, selectedRole, handleRoleChange, handleSubmit, assignRoleMutation } = useRoles(employeeDni);

  // Mostrar spinner mientras los roles se están cargando
  if (isLoadingRoles) return <LoadingSpinner />;
  // Mostrar mensaje de error si falla la carga de datos
  if (isErrorRoles) return <div>Error al cargar los roles.</div>;

  // Función para manejar la asignación de rol con Toast y redirección
  const handleRoleAssignment = () => {
    handleSubmit(() => {
      showToast('Rol asignado correctamente.', 'success'); // Mostrar mensaje de éxito
      setTimeout(() => {
        navigate('/dashboard'); // Redirigir al dashboard después de 2 segundos
      }, 2000);
    });
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]"> {/* Contenedor centrado vertical y horizontalmente */}
      <div className={`w-full max-w-[600px] mx-auto p-8 ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'} rounded-[20px] shadow-2xl`}>
        <h3 className={`text-3xl font-semibold mb-8 text-center font-poppins ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Asignar rol al empleado
        </h3>

        {/* Dividir opciones en dos columnas con grid */}
        <div className="roles-list grid grid-cols-2 gap-y-6 gap-x-8 mx-[150px] justify-items-start"> {/* Configuración de grid con columnas y alineación */}
          {roles?.map((role: any) => (
            <div key={role.idRole} className="flex items-center"> {/* Contenedor de cada opción */}
              <input
                type="radio"
                id={`role-${role.idRole}`}
                name="role"
                value={role.idRole}
                checked={selectedRole === role.idRole}
                onChange={() => handleRoleChange(role.idRole)}
                className={`mr-3 focus:ring-0 h-5 w-5 rounded-full border-2 ${
                  isDarkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-400'
                }`} // Ajustar border y focus:ring-0 para eliminar cuadro de enfoque
              />
              <label
                htmlFor={`role-${role.idRole}`}
                className={`text-lg cursor-pointer transition-colors duration-200 ${
                  selectedRole === role.idRole
                    ? 'text-blue-600 font-semibold' // Cambiar el color y estilo del texto si está seleccionado
                    : isDarkMode
                    ? 'text-white hover:text-blue-500'
                    : 'text-gray-800 hover:text-blue-500'
                }`}
              >
                {role.nameRole}
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-6 mt-10">
          {/* Botón Cancelar */}
          <button
            onClick={onCancel}
            className={`px-7 py-4 bg-red-500 text-white text-lg font-inter rounded-lg shadow-lg hover:bg-red-600 transition duration-200`}
          >
            Cancelar
          </button>

          {/* Botón para asignar el rol */}
          <button
            onClick={handleRoleAssignment} // Llamar a la función de asignación
            disabled={!selectedRole || assignRoleMutation.isLoading}
            className={`type-button px-7 py-4 text-white text-lg font-inter rounded-lg shadow-lg transition duration-200 ${
              assignRoleMutation.isLoading ? 'bg-blue-500' : isDarkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {assignRoleMutation.isLoading ? 'Asignando...' : 'Asignar Rol'}
          </button>
        </div>
        
        {/* Componente de Toast */}
        <Toast message={message} type={type} />
      </div>
    </div>
  );
};

export default RoleAssignment;
