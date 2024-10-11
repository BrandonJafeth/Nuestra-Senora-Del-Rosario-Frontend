import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { useResidents } from '../../hooks/useResidents';
import { Resident } from '../../types/ResidentsType';
import { useRoom } from '../../hooks/useRoom'; // Para cargar las habitaciones
import { useDependencyLevel } from '../../hooks/useDependencyLevel'; // Para cargar los niveles de dependencia
import { useUpdateResidentDetails } from '../../hooks/useUpdateResidentDetails'; // Importa el nuevo hook

function ResidentList() {
  const { data: residents = [], isLoading, error } = useResidents();
  const { data: rooms = [] } = useRoom(); // Cargar las habitaciones
  const { data: dependencyLevels = [] } = useDependencyLevel(); // Cargar los niveles de dependencia
  const [searchTerm, setSearchTerm] = useState(''); // Estado para búsqueda
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null); // Residente seleccionado
  const [showModal, setShowModal] = useState(false); // Estado para manejar la visibilidad del modal
  const navigate = useNavigate();

  // Hook para actualizar el residente
  const {
    id_Room,
    entryDate,
    sexo,
    id_DependencyLevel,
    setRoomNumber,
    setEntryDate,
    setSexo,
    setDependencyLevel,
    handleSubmit,
    isLoading: isUpdating,
  } = useUpdateResidentDetails(selectedResident?.id_Resident ?? 0);

  // Manejar la visualización de detalles en el modal
  const handleShowDetails = (resident: Resident) => {
    setSelectedResident(resident);
    setRoomNumber(resident.id_Room?.toString() ?? '');
    setEntryDate(resident.entryDate ?? '');
    setSexo(resident.sexo);
    setDependencyLevel(resident.dependencyLevel?.toString() ?? '');
    setShowModal(true); // Mostrar el modal
  };

  // Cerrar el modal
  const handleCloseDetails = () => {
    setSelectedResident(null);
    setShowModal(false); // Ocultar el modal
  };

  if (isLoading) {
    return <Skeleton count={5} />;
  }

  if (error) {
    return <div>Error al cargar los residentes</div>;
  }

  return (
    <div className="w-full max-w-[1169px] mx-auto p-6 bg-white rounded-[20px] shadow-2xl">
      {/* Título y Botones */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-center">Listado de Residentes</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/dashboard/solicitudesAprobadas')}
            className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition duration-200"
          >
            Solicitudes Aprobadas
          </button>
          <button
            onClick={() => navigate('/dashboard/NuevoResidente')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
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
          className="w-full max-w-md p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Tabla de Residentes */}
      {residents.length > 0 ? (
        <div className="flex justify-center">
          <table className="min-w-full max-w-5xl bg-transparent rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="p-4">Nombre</th>
                <th className="p-4">Primer Apellido</th>
                <th className="p-4">Segundo Apellido</th>
                <th className="p-4">Cédula</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {residents.map((resident: Resident) => (
                <tr key={resident.id_Resident} className="bg-white text-gray-800 hover:bg-gray-200 text-center">
                  <td className="p-4">{resident.name_AP}</td>
                  <td className="p-4">{resident.lastname1_AP}</td>
                  <td className="p-4">{resident.lastname2_AP}</td>
                  <td className="p-4">{resident.cedula_AP}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleShowDetails(resident)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
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

      {/* Modal de Detalles del Residente Seleccionado */}
      {showModal && selectedResident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
            <h3 className="text-2xl font-bold mb-6">Detalles del Residente</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold">Habitación:</label>
                <select
                  value={id_Room}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full p-2 mt-1 border rounded-md"
                >
                  {rooms.map((room) => (
                    <option key={room.id_Room} value={room.id_Room}>
                      {room.roomNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold">Grado de Dependencia:</label>
                <select
                  value={id_DependencyLevel}
                  onChange={(e) => setDependencyLevel(e.target.value)}
                  className="w-full p-2 mt-1 border rounded-md"
                >
                  {dependencyLevels.map((level) => (
                    <option key={level.id_DependencyLevel} value={level.id_DependencyLevel}>
                      {level.levelName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold">Sexo:</label>
                <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                  className="w-full p-2 mt-1 border rounded-md"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </div>

              <div>
                <label className="block font-bold">Fecha de Entrada:</label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full p-2 mt-1 border rounded-md"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseDetails}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isUpdating}
                className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                {isUpdating ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResidentList;
