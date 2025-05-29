import React, { useState, useEffect } from 'react';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useNavigate } from 'react-router-dom';
import ReusableTableRequests from '../microcomponents/ReusableTableRequests';
import RoleAssignment from './RoleAssignment';
import { User } from '../../types/UserType';
import UserStatusModal from '../microcomponents/UserStatusModal';
import { usePaginatedUsers } from '../../hooks/useUsers';
import { useAllUsers } from '../../hooks/useAllUsers';
import SearchInput from '../common/SearchInput';

const UserList: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para almacenar usuarios filtrados para mostrar
  const [displayUsers, setDisplayUsers] = useState<User[]>([]);
  // Estado para el total de páginas según la búsqueda
  const [totalPages, setTotalPages] = useState(1);

  // Obtener usuarios paginados (para visualización normal)
  const { 
    data: paginatedData, 
    isLoading: paginatedLoading, 
    isError: paginatedError, 
    error 
  } = usePaginatedUsers(pageNumber, pageSize);
  
  // Obtener TODOS los usuarios (para búsqueda global)
  const { 
    data: allUsers, 
    isLoading: allUsersLoading, 
    isError: allUsersError 
  } = useAllUsers();
  
  const { isDarkMode } = useThemeDark();
  const navigate = useNavigate();

  // Estado compuesto para la carga
  const isLoading = paginatedLoading || allUsersLoading;
  const isError = paginatedError || allUsersError;

  const [selectedUser, setSelectedUser] = useState<{ id_User: number; fullName: string } | null>(null);
  const [userStatusModal, setUserStatusModal] = useState<{ id_User: number; is_Active: boolean } | null>(null);

  // Filtrado y paginación de usuarios
  useEffect(() => {
    // Si hay un término de búsqueda, filtramos en todos los usuarios
    if (searchTerm.trim()) {
      const filtered = (allUsers || []).filter((user) =>
        `${user.dni} ${user.fullName} ${user.email}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      
      // Calcular el total de páginas basado en los resultados filtrados
      const calculatedTotalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
      setTotalPages(calculatedTotalPages);
      
      // Ajustar página actual si excede el total de páginas
      const adjustedPageNumber = Math.min(pageNumber, calculatedTotalPages);
      if (adjustedPageNumber !== pageNumber) {
        setPageNumber(adjustedPageNumber);
      }
      
      // Paginar los resultados filtrados
      const start = (adjustedPageNumber - 1) * pageSize;
      const end = start + pageSize;
      setDisplayUsers(filtered.slice(start, end));
    } else {
      // Si no hay término de búsqueda, usamos los datos paginados del servidor
      setDisplayUsers(paginatedData?.users || []);
      setTotalPages(paginatedData?.totalPages || 1);
    }
  }, [searchTerm, allUsers, paginatedData, pageNumber, pageSize]);
  
  if (isError) return <p>Error al cargar los usuarios: {error?.message}</p>;
  // 2. Funciones de paginación
  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  };

  // 3. Funciones para creación y edición
  const handleCreateUser = () => {
    navigate('/dashboard/usuarios/crear');
  };

  const handleCreateUserFromEmployee = () => {
    navigate('/dashboard/usuarios/crear-por-empleado');
  };

  const handleOpenAssignRoleModal = (id_User: number, fullName: string) => {
    setSelectedUser({ id_User, fullName });
    // Add a class to the body to prevent scrolling while modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleOpenStatusModal = (id_User: number, is_Active: boolean) => {
    setUserStatusModal({ id_User, is_Active });
    // Add a class to the body to prevent scrolling while modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseAssignRoleModal = () => {
    setSelectedUser(null);
    // Restore scrolling when modal is closed
    document.body.style.overflow = '';
  };

  const handleCloseStatusModal = () => {
    setUserStatusModal(null);
    // Restore scrolling when modal is closed
    document.body.style.overflow = '';
  };

  // 4. Cambio de cantidad de registros por página
  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setPageNumber(1);
  };

  return (
    <div
      className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${
        isDarkMode ? 'bg-[#0D313F]' : 'bg-white'
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2
          className={`text-3xl font-bold mb-4 sm:mb-0 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Lista de usuarios
        </h2>

        {/* Controles: Crear usuario, combo de página, etc. */}
        <div className="flex flex-wrap items-center space-x-4">
          <button
            onClick={handleCreateUser}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-all"
          >
            Crear usuario
          </button>
          <button
            onClick={handleCreateUserFromEmployee}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-all"
          >
            Crear usuario por empleado
          </button>
          <div className="flex items-center">
            <label
              htmlFor="pageSize"
              className={`mr-2 text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
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
      </div>      {/* 5. Input para filtrar */}
      <div className="mb-4 justify-center items-center flex">
        <div className="w-full max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por cédula, nombre o correo en todos los usuarios"
            isDarkMode={isDarkMode}
            className="w-full"
          />
        </div>
      </div>{/* 6. Tabla reutilizable con usuarios filtrados */}
      <ReusableTableRequests<User>
        data={displayUsers} // Ahora pasamos los usuarios filtrados globalmente
        headers={['Cédula', 'Nombre de usuario', 'Correo', 'Activo', 'Roles', 'Acciones']}
        isLoading={isLoading}
        skeletonRows={5}
        isDarkMode={isDarkMode}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        renderRow={(user) => (
          <tr
            key={user.id_User}
            className={`${
              isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-white text-gray-800 hover:bg-gray-200'
            }`}
          >
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

      {/* Modales */}
      {selectedUser && (
        <RoleAssignment
          isOpen={!!selectedUser}
          onClose={handleCloseAssignRoleModal}
          userId={selectedUser.id_User}
          userName={selectedUser.fullName}
        />
      )}

      {userStatusModal && (
        <UserStatusModal
          userId={userStatusModal.id_User}
          currentStatus={userStatusModal.is_Active}
          onClose={handleCloseStatusModal}
        />
      )}
    </div>
  );
};

export default UserList;
