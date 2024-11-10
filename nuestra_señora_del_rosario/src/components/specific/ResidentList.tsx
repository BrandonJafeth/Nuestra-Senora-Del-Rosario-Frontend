import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { useResidents } from '../../hooks/useResidents';
import { Resident } from '../../types/ResidentsType';
import { useRoom } from '../../hooks/useRoom';
import { useDependencyLevel } from '../../hooks/useDependencyLevel';
import { useUpdateResidentDetails } from '../../hooks/useUpdateResidentDetails';
import { useThemeDark } from '../../hooks/useThemeDark'; // Hook para modo oscuro

// Helper para formatear las fechas (YYYY-MM-DD)
const formatDate = (dateString: string) => {
  return new Date(dateString).toISOString().split('T')[0];
};

function ResidentList() {
  // Obtenemos el estado de modo oscuro
  const { isDarkMode } = useThemeDark();

  // Obtenemos la función refetch
  const { data: residents = [], isLoading, error, refetch } = useResidents();
  const { data: rooms = [] } = useRoom();
  const { data: dependencyLevels = [] } = useDependencyLevel();
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null); 
  const [showModal, setShowModal] = useState<boolean>(false); 
  const navigate = useNavigate();

  // Estado para controlar si estamos en modo edición
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Estado para los campos editables
  const [idRoom, setIdRoom] = useState<number | undefined>(undefined);
  const [idDependencyLevel, setIdDependencyLevel] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<string>('Activo'); 
  const [sexo, setSexo] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Hook para actualizar el residente
  const { handleSubmit } = useUpdateResidentDetails(selectedResident?.id_Resident ?? 0);

  // Manejar la visualización de detalles en el modal
  const handleShowDetails = (resident: Resident) => {
    setSelectedResident(resident);
    setIdRoom(resident.id_Room ?? ''); 
    setIdDependencyLevel(resident.id_DependencyLevel ?? ''); 
    setStatus(resident.status ?? 'Activo'); 
    setSexo(resident.sexo ?? '');
    setIsEditing(false); // Inicialmente, no estamos editando
    setShowModal(true); 
  };

  // Cerrar el modal
  const handleCloseDetails = () => {
    setSelectedResident(null);
    setShowModal(false);
  };

  // Filtrar residentes según el término de búsqueda
  const filteredResidents = residents.filter((resident) =>
    `${resident.name_AP} ${resident.lastname1_AP} ${resident.cedula_AP}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Función para manejar el inicio de edición
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Función para manejar la actualización al hacer clic en el botón "Guardar"
  const handleUpdateClick = async () => {
    setIsUpdating(true);
    const updatedResidentData = {
      id_Room: idRoom || undefined,
      id_DependencyLevel: idDependencyLevel || undefined,
      status,
      sexo,
    };

    // Envía los datos actualizados al servidor
    await handleSubmit(updatedResidentData);

    // Refrescar la lista de residentes desde el servidor
    await refetch();

    // Obtener el residente actualizado de la lista de residentes
    const updatedResident = residents.find((resident) => resident.id_Resident === selectedResident?.id_Resident);

    if (updatedResident) {
      // Actualizar el selectedResident con los datos actualizados
      setSelectedResident(updatedResident);

      // Actualizar los estados locales con los nuevos datos
      setIdRoom(updatedResident.id_Room ?? '');
      setIdDependencyLevel(updatedResident.id_DependencyLevel ?? '');
      setStatus(updatedResident.status ?? 'Activo');
      setSexo(updatedResident.sexo ?? '');
    }

    setIsUpdating(false);
    setIsEditing(false); // Salimos del modo edición
    setShowModal(false); // Cerramos el modal (opcional)
  };

  if (isLoading) {
    return <Skeleton count={5} />;
  }

  if (error) {
    return <div>Error al cargar los residentes</div>;
  }

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex justify-between items-center mb-8">
        <h2 className={`text-3xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Listado de Residentes</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/dashboard/solicitudesAprobadas')}
            className={`px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-800 hover:bg-blue-900'} text-white`}
          >
            Solicitudes Aprobadas
          </button>
          <button
            onClick={() => navigate('/dashboard/NuevoResidente')}
            className={`px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-green-500 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white`}
          >
            Nuevo Residente
          </button>
        </div>
      </div>

      {/* Filtro de búsqueda */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o cédula"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full max-w-md p-3 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 text-white focus:ring-blue-400' : 'text-gray-700 focus:ring-blue-600'}`}
        />
      </div>

      {/* Tabla de Residentes */}
      {filteredResidents.length > 0 ? (
        <div className="flex justify-center">
          <table className={`min-w-full max-w-5xl rounded-lg shadow-md ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'}`}>
            <thead>
              <tr className={`text-center ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
                <th className="p-4">Nombre</th>
                <th className="p-4">Primer Apellido</th>
                <th className="p-4">Segundo Apellido</th>
                <th className="p-4">Cédula</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredResidents.map((resident: Resident) => (
                <tr key={resident.id_Resident} className={`text-center ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-200'}`}>
                  <td className="p-4">{resident.name_AP}</td>
                  <td className="p-4">{resident.lastname1_AP}</td>
                  <td className="p-4">{resident.lastname2_AP}</td>
                  <td className="p-4">{resident.cedula_AP}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleShowDetails(resident)}
                      className={`px-4 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                    >
                      Ver Más Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500">No se encontraron residentes.</div>
      )}

{showModal && selectedResident && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className={`rounded-lg shadow-lg p-8 w-full max-w-4xl ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'}`}>
      <h3 className="text-2xl font-bold mb-6">Detalles del Residente</h3>

      <div className="grid grid-cols-2 gap-4">
      {/* Número de habitación */}
      <div>
                <label className="block font-bold">Habitación:</label>
                {isEditing ? (
                  <select
                    value={idRoom ?? selectedResident.roomNumber}
                    onChange={(e) => setIdRoom(Number(e.target.value))}
                    className={`w-full p-2 mt-1 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
                  >
                    <option value="">Selecciona una habitación</option>
                    {rooms.map((room) => (
                      <option key={room.id_Room} value={room.id_Room}>
                        {room.roomNumber}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-1 p-2 border rounded-md bg-gray-500 text-white cursor-not-allowed">{selectedResident.roomNumber}</p>
                )}
              </div>

              {/* Grado de Dependencia */}
              <div>
                <label className="block font-bold">Grado de Dependencia:</label>
                {isEditing ? (
                  <select
                    value={idDependencyLevel ?? selectedResident.dependencyLevel}
                    onChange={(e) => setIdDependencyLevel(Number(e.target.value))}
                    className={`w-full p-2 mt-1 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
                  >
                    <option value="">Selecciona un grado de dependencia</option>
                    {dependencyLevels.map((level) => (
                      <option key={level.id_DependencyLevel} value={level.id_DependencyLevel}>
                        {level.levelName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-1 p-2 border rounded-md bg-gray-500 text-white cursor-not-allowed">{selectedResident.dependencyLevel}</p>
                )}
              </div>

        {/* Estado */}
        <div>
          <label className="block font-bold">Estado:</label>
          {isEditing ? (
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className={`w-full p-2 mt-1 border rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
    >
      <option value="">Selecciona un estado</option>
      <option value="Femenino">Activo</option>
      <option value="Masculino">Inactivo</option>
    </select>
  ) : (
    <p className="mt-1 p-2 border rounded-md bg-gray-500 text-white cursor-not-allowed">{status || 'No especificado'}</p>
  )}
        </div>

        {/* Sexo */}
              <div>
  <label className="block font-bold">Sexo:</label>
  {isEditing ? (
    // Si deseas deshabilitar la edición completamente, muestra el sexo como texto en lugar del select
    <p className="mt-1 p-2 border rounded-md bg-gray-500 text-white cursor-not-allowed">
      {sexo || 'No especificado'}
    </p>
  ) : (
    <p className="mt-1 p-2 border rounded-md bg-gray-500 text-white cursor-not-allowed">
      {sexo || 'No especificado'}
    </p>
  )}
</div>



        {/* Fecha de Nacimiento */}
        <div>
          <label className="block font-bold">Fecha de Nacimiento:</label>
          <input
            type="text"
            value={formatDate(selectedResident.fechaNacimiento)} 
            className={`w-full p-2 mt-1 border rounded-md bg-gray-500 text-white cursor-not-allowed`}
            readOnly
          />
        </div>

        {/* Estado */}

        {/* Fecha de Entrada */}
        <div>
          <label className="block font-bold">Fecha de Entrada:</label>
          <input
            type="text"
            value={formatDate(selectedResident.entryDate)}
            className={`w-full p-2 mt-1 border rounded-md bg-gray-500 text-white cursor-not-allowed`}
            readOnly
          />
        </div>

        {/* Edad */}
        <div>
          <label className="block font-bold">Edad:</label>
          <input
            type="text"
            value={selectedResident.edad.toString()}
            className={`w-full p-2 mt-1 border rounded-md bg-gray-500 text-white cursor-not-allowed`}
            readOnly
          />
        </div>

        {/* Nombre del Guardián */}
        <div>
          <label className="block font-bold">Nombre del Encargado:</label>
          <input
            type="text"
            value={selectedResident.guardianName}
            className={`w-full p-2 mt-1 border rounded-md bg-gray-500 text-white cursor-not-allowed`}
            readOnly
          />
        </div>

        {/* Teléfono del Guardián */}
        <div>
          <label className="block font-bold">Teléfono del Encargado:</label>
          <input
            type="text"
            value={selectedResident.guardianPhone}
            className={`w-full p-2 mt-1 border rounded-md bg-gray-500 text-white cursor-not-allowed`}
            readOnly
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleCloseDetails}
          className={`px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-red-500 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'} text-white`}
        >
          {isEditing ? 'Cancelar' : 'Cerrar'}
        </button>
        {!isEditing ? (
          <button
            onClick={handleEditClick}
            className={`ml-4 px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            Editar
          </button>
        ) : (
          <button
            onClick={handleUpdateClick}
            disabled={isUpdating}
            className={`ml-4 px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            {isUpdating ? 'Guardando...' : 'Guardar'}
          </button>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default ResidentList;
