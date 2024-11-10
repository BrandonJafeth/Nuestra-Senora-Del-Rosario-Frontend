import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { useResidents } from '../../hooks/useResidents';
import { Resident } from '../../types/ResidentsType';
import { useRoom } from '../../hooks/useRoom';
import { useDependencyLevel } from '../../hooks/useDependencyLevel';
import { useUpdateResidentDetails } from '../../hooks/useUpdateResidentDetails';
import { useThemeDark } from '../../hooks/useThemeDark';
import Toast from '../common/Toast';
import { useToast } from '../../hooks/useToast';

// Helper para formatear las fechas (YYYY-MM-DD)
const formatDate = (dateString: string) => {
  return new Date(dateString).toISOString().split('T')[0];
};

function ResidentList() {
  const { isDarkMode } = useThemeDark();
  const { data: residents = [], isLoading, error, refetch } = useResidents();
  const { data: rooms = [] } = useRoom();
  const { data: dependencyLevels = [] } = useDependencyLevel();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const {showToast, message, type} = useToast();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [idRoom, setIdRoom] = useState<number | ''>('');
  const [idDependencyLevel, setIdDependencyLevel] = useState<number | ''>('');
  const [status, setStatus] = useState<string>('Activo');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const { handleSubmit } = useUpdateResidentDetails(selectedResident?.id_Resident ?? 0);

  const handleShowDetails = (resident: Resident) => {
    setSelectedResident(resident);
    setIdRoom(resident.id_Room ?? '');
    setIdDependencyLevel(resident.id_DependencyLevel ?? '');
    setStatus(resident.status ?? 'Activo');
    setIsEditing(false);
    setShowModal(true);
  };

  const handleCloseDetails = () => {
    setSelectedResident(null);
    setShowModal(false);
  };

  const filteredResidents = residents.filter((resident) =>
    `${resident.name_AP} ${resident.lastname1_AP} ${resident.cedula_AP}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = async () => {
    setIsUpdating(true);
    const updatedResidentData = {
      id_Room: idRoom || undefined,
      id_DependencyLevel: idDependencyLevel || undefined,
      status,
    };

    await handleSubmit(updatedResidentData);
    await refetch();

    const updatedResident = residents.find(
      (resident) => resident.id_Resident === selectedResident?.id_Resident
    );

    if (updatedResident) {
      setSelectedResident(updatedResident);
      setIdRoom(updatedResident.id_Room ?? '');
      setIdDependencyLevel(updatedResident.id_DependencyLevel ?? '');
      setStatus(updatedResident.status ?? 'Activo');
    }
showToast('Error al actualizar el residente', 'error');
    setIsUpdating(false);
    setIsEditing(false);
    setShowModal(false);
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

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o cédula"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full max-w-md p-3 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 text-white focus:ring-blue-400' : 'text-gray-700 focus:ring-blue-600'}`}
        />
      </div>

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

              <div>
                <label className="block font-bold">Estado:</label>
                <input
                  type="text"
                  value={status}
                  readOnly={!isEditing}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full p-2 mt-1 border rounded-md ${isEditing ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200') : 'bg-gray-500 text-white cursor-not-allowed'}`}
                />
              </div>
              
              <div>
                <label className="block font-bold">Sexo:</label>
                <input
                  type="text"
                  value={selectedResident.sexo || 'No especificado'}
                  readOnly
                  className="w-full p-2 mt-1 border rounded-md bg-gray-500 text-white cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold">Fecha de Nacimiento:</label>
                <input
                  type="text"
                  value={formatDate(selectedResident.fechaNacimiento)}
                  readOnly
                  className="w-full p-2 mt-1 border rounded-md bg-gray-500 text-white cursor-not-allowed"
                />
              </div>


              <div>
                <label className="block font-bold">Fecha de Entrada:</label>
                <input
                  type="text"
                  value={formatDate(selectedResident.entryDate)}
                  readOnly
                  className="w-full p-2 mt-1 border rounded-md bg-gray-500 text-white cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold">Edad:</label>
                <input
                  type="text"
                  value={selectedResident.edad.toString()}
                  readOnly
                  className="w-full p-2 mt-1 border rounded-md bg-gray-500 text-white cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold">Nombre del Guardián:</label>
                <input
                  type="text"
                  value={selectedResident.guardianName}
                  readOnly
                  className="w-full p-2 mt-1 border rounded-md bg-gray-500 text-white cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold">Teléfono del Guardián:</label>
                <input
                  type="text"
                  value={selectedResident.guardianPhone}
                  readOnly
                  className="w-full p-2 mt-1 border rounded-md bg-gray-500 text-white cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseDetails}
                className={`px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-red-500 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'} text-white`}
              tabIndex={1}
              >
                {isEditing ? 'Cancelar' : 'Cerrar'}
              </button>
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className={`ml-4 px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
               tabIndex={0}
               >
                  Editar
                </button>
              ) : (
                <button
                  onClick={handleUpdateClick}
                  disabled={isUpdating}
                  className={`ml-4 px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                tabIndex={0}
                >
                  {isUpdating ? 'Guardando...' : 'Guardar'}
                </button>
              )}
              <Toast message={message} type={type}/>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default ResidentList;
