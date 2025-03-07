import React, { useState } from 'react';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useNavigate } from 'react-router-dom';
import ReusableTableRequests from '../microcomponents/ReusableTableRequests';
import RoleAssignment from './RoleAssignment';
import { User } from '../../types/UserType';
import UserStatusModal from '../microcomponents/UserStatusModal';
import { usePaginatedUsers } from '../../hooks/useUsers';

const UserList: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5); // 🔹 Estado para la cantidad de registros por página
  const { data, isLoading, isError, error } = usePaginatedUsers(pageNumber, pageSize);
  const { isDarkMode } = useThemeDark();
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState<{ id_User: number; fullName: string } | null>(null);
  const [userStatusModal, setUserStatusModal] = useState<{ id_User: number; is_Active: boolean } | null>(null);

  if (isError) return <p>Error al cargar los usuarios: {error?.message}</p>;

  const handleNextPage = () => {
    if (data && pageNumber < data.totalPages) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  };

  const handleCreateUser = () => {
    navigate('/dashboard/usuarios/crear');
  };

  const handleCreateUserFromEmployee = () => {
    navigate('/dashboard/usuarios/crear-por-empleado');
  };

  const handleOpenAssignRoleModal = (id_User: number, fullName: string) => {
    setSelectedUser({ id_User, fullName });
  };

  const handleOpenStatusModal = (id_User: number, is_Active: boolean) => {
    setUserStatusModal({ id_User, is_Active });
  };

   const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setPageSize(Number(event.target.value));
      setPageNumber(1); 
    };

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Lista de Usuarios
        </h2>

        <div className="flex items-center space-x-4">
          <button onClick={handleCreateUser} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-all">
            Crear Usuario
          </button>
          <button onClick={handleCreateUserFromEmployee} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-all">
            Crear Usuario por Empleado
          </button>
        <div className="flex items-center">
    <label
      htmlFor="pageSize"
      className={`mr-2 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
    >
      Mostrar:
    </label>
    <select
      id="pageSize"
      value={pageSize}
      onChange={handlePageSizeChange}
      className={`p-2 border rounded-lg ${
        isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
      }`}
    >
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="15">15</option>
      <option value="20">20</option>
    </select>
  </div>
        </div>
      </div>

     

      <ReusableTableRequests<User>
  data={Array.isArray(data?.users) ? data.users : []}  // Evita errores de `map()`
  headers={['Cédula', 'Nombre de Usuario', 'Correo', 'Activo', 'Roles', 'Acciones']}
  isLoading={isLoading}
  skeletonRows={5}
  isDarkMode={isDarkMode}
  pageNumber={pageNumber}
  totalPages={data?.totalPages || 1} // Evita errores si `totalPages` es `undefined`
  onNextPage={handleNextPage}
  onPreviousPage={handlePreviousPage}
  renderRow={(user) => (
    <tr key={user.id_User} className={`${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-200'}`}>
      <td className="p-4">{user.dni}</td>
      <td className="p-4">{user.fullName}</td>
      <td className="p-4">{user.email}</td>
      <td className="p-4">{user.is_Active ? 'Sí' : 'No'}</td>
      <td className="p-4">{user.roles?.join(', ') || 'Sin rol'}</td>
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


      {selectedUser && (
        <RoleAssignment
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          userId={selectedUser.id_User}
          userName={selectedUser.fullName}
        />
      )}

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
