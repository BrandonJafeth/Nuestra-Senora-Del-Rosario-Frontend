import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useNavigate } from 'react-router-dom';
import ReusableTableRequests from '../microcomponents/ReusableTableRequests';
import RoleAssignment from './RoleAssignment'; // Modal de asignación de roles
import { User } from '../../types/UserType';
import UserStatusModal from '../microcomponents/UserStatusModal';

const UserList: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const { data, isLoading, isError, error } = useUsers(pageNumber, pageSize);
  const { isDarkMode } = useThemeDark();
  const navigate = useNavigate();
  console.log('data =>', data);

  // Estado para manejar el modal de asignación de roles
  const [selectedUser, setSelectedUser] = useState<{ id_User: number; fullName: string } | null>(null);

  // Estado para manejar el modal de edición del estado del usuario
  const [userStatusModal, setUserStatusModal] = useState<{ id_User: number; is_Active: boolean } | null>(null);

  if (isError) return <p>Error al cargar los usuarios: {error?.message}</p>;

  const handleNextPage = () => {
    if (data && pageNumber < Math.ceil(data.count / pageSize)) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleCreateUser = () => {
    navigate('/dashboard/usuarios/crear'); // Ruta hacia el formulario de creación de usuario
  };

  const handleCreateUserFromEmployee = () => {
    navigate('/dashboard/usuarios/crear-por-empleado'); // Ruta hacia el formulario de creación de usuario
  };

  // Abre el modal de asignación de roles
  const handleOpenAssignRoleModal = (id_User: number, fullName: string) => {
    setSelectedUser({ id_User, fullName });
  };

  // Abre el modal para editar el estado del usuario
  const handleOpenStatusModal = (id_User: number, is_Active: boolean) => {
    setUserStatusModal({ id_User, is_Active });
  };

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Lista de Usuarios
        </h2>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleCreateUser}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-all"
          >
          Crear Usuario
          </button>
          <button
            onClick={handleCreateUserFromEmployee}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-all"
          >
            Crear Usuario por Empleado
          </button>
        </div>
      </div>

      <ReusableTableRequests<User>
        data={data?.users || []}  
        headers={['Cédula', 'Nombre de Usuario', 'Correo', 'Activo', 'Roles', 'Acciones']}
        isLoading={isLoading}
        skeletonRows={5}
        isDarkMode={isDarkMode}
        pageNumber={pageNumber}
        totalPages={Math.ceil((data?.count || 0) / pageSize)}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        renderRow={(user) => (
          <tr
            key={user.id_User}
            className={`${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
          >
            <td className="p-4">{user.dni}</td>
            <td className="p-4">{user.fullName}</td>
            <td className="p-4">{user.email}</td>
            <td className="p-4">{user.is_Active ? 'Sí' : 'No'}</td>
            <td className="p-4">{user.roles.join(', ')}</td>
            <td className="p-4">
  <div className="flex space-x-2">
    <button
      onClick={() => handleOpenAssignRoleModal(user.id_User, user.fullName)}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
    >
      Asignar
    </button>
    <button
      onClick={() => handleOpenStatusModal(user.id_User, user.is_Active)}
      className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition duration-200"
    >
      Editar
    </button>
  </div>
</td>
          </tr>
        )}
      />

      {/* Modal para asignar roles */}
      {selectedUser && (
        <RoleAssignment
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          userId={selectedUser.id_User}
          userName={selectedUser.fullName}
        />
      )}

      {/* Modal para editar estado del usuario */}
      {userStatusModal && (
        <UserStatusModal
          userId={userStatusModal.id_User}
          currentStatus={userStatusModal.is_Active}
          onClose={() => setUserStatusModal(null)}
        />
      )}
    </div>
  );
};

export default UserList;
