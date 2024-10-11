import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { useResidents } from '../../hooks/useResidents';
import { Resident } from '../../types/ResidentsType';
import { useRoom } from '../../hooks/useRoom'; // Para cargar las habitaciones
import { useDependencyLevel } from '../../hooks/useDependencyLevel'; // Para cargar los niveles de dependencia
import { useUpdateResidentDetails } from '../../hooks/useUpdateResidentDetails'; // Hook para actualizar detalles del residente

// Helper para formatear las fechas (YYYY-MM-DD)
const formatDate = (dateString: string) => {
  return new Date(dateString).toISOString().split('T')[0]; // Deja solo la parte de la fecha
};

function ResidentList() {
  const { data: residents = [], isLoading, error } = useResidents();
  const { data: rooms = [] } = useRoom(); 
  const { data: dependencyLevels = [] } = useDependencyLevel();
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null); 
  const [showModal, setShowModal] = useState<boolean>(false); 
  const [status, setStatus] = useState<string>('Activo'); // Local state para status
  const navigate = useNavigate();

  // Hook para actualizar el residente
  const {
    idRoom, 
    idDependencyLevel,
    setIdRoom,
    setIdDependencyLevel,
    handleSubmit,
    isLoading: isUpdating,
  } = useUpdateResidentDetails(selectedResident?.id_Resident ?? 0);

  // Manejar la visualización de detalles en el modal
  const handleShowDetails = (resident: Resident) => {
    setSelectedResident(resident);
    setIdRoom(resident.id_Room ?? 0); 
    setIdDependencyLevel(resident.id_DependencyLevel ?? 0); 
    setStatus(resident.status ?? 'Activo'); 
    setShowModal(true); 
  };

  // Cerrar el modal
  const handleCloseDetails = () => {
    setSelectedResident(null);
    setShowModal(false);
  };

  if (isLoading) {
    return <Skeleton count={5} />;
  }

  if (error) {
    return <div>Error al cargar los residentes</div>;
  }

  // Filtrar residentes según el término de búsqueda
  const filteredResidents = residents.filter((resident) =>
    `${resident.name_AP} ${resident.lastname1_AP} ${resident.cedula_AP}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleUpdateClick = () => {
    console.log('Botón de actualizar clicado');
    handleSubmit();
  };

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
      {filteredResidents.length > 0 ? (
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
              {filteredResidents.map((resident: Resident) => (
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
              {/* Número de habitación */}
              <div>
                <label className="block font-bold">Habitación:</label>
                <select
                  value={idRoom}
                  onChange={(e) => setIdRoom(Number(e.target.value))} // Convertir el valor a número
                  className="w-full p-2 mt-1 border rounded-md"
                >
                  {rooms.map((room) => (
                    <option key={room.id_Room} value={room.id_Room}>
                      {room.roomNumber}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grado de Dependencia */}
              <div>
                <label className="block font-bold">Grado de Dependencia:</label>
                <select
                  value={idDependencyLevel}
                  onChange={(e) => setIdDependencyLevel(Number(e.target.value))} // Convertir el valor a número
                  className="w-full p-2 mt-1 border rounded-md"
                >
                  {dependencyLevels.map((level) => (
                    <option key={level.id_DependencyLevel} value={level.id_DependencyLevel}>
                      {level.levelName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sexo (No editable) */}
              <div>
                <label className="block font-bold">Sexo:</label>
                <input
                  type="text"
                  value={selectedResident.sexo} // Mostrar sin ser editable
                  className="w-full p-2 mt-1 border rounded-md bg-gray-200 cursor-not-allowed"
                  readOnly
                />
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label className="block font-bold">Fecha de Nacimiento:</label>
                <input
                  type="text"
                  value={formatDate(selectedResident.fechaNacimiento)} // Mostrar sin ser editable
                  className="w-full p-2 mt-1 border rounded-md bg-gray-200 cursor-not-allowed"
                  readOnly
                />
              </div>

              {/* Estado */}
              <div>
                <label className="block font-bold">Estado:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 mt-1 border rounded-md"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              {/* Fecha de Entrada */}
              <div>
                <label className="block font-bold">Fecha de Entrada:</label>
                <input
                  type="text"
                  value={formatDate(selectedResident.entryDate)} // Mostrar sin ser editable
                  className="w-full p-2 mt-1 border rounded-md bg-gray-200 cursor-not-allowed"
                  readOnly
                />
              </div>

              {/* Edad */}
              <div>
                <label className="block font-bold">Edad:</label>
                <input
                  type="text"
                  value={selectedResident.edad.toString()} // Mostrar la edad calculada
                  className="w-full p-2 mt-1 border rounded-md bg-gray-200 cursor-not-allowed"
                  readOnly
                />
              </div>

              {/* Nombre del Guardián */}
              <div>
                <label className="block font-bold">Nombre del Guardián:</label>
                <input
                  type="text"
                  value={selectedResident.guardianName} // Mostrar sin ser editable
                  className="w-full p-2 mt-1 border rounded-md bg-gray-200 cursor-not-allowed"
                  readOnly
                />
              </div>

              {/* Teléfono del Guardián */}
              <div>
                <label className="block font-bold">Teléfono del Guardián:</label>
                <input
                  type="text"
                  value={selectedResident.guardianPhone} // Mostrar sin ser editable
                  className="w-full p-2 mt-1 border rounded-md bg-gray-200 cursor-not-allowed"
                  readOnly
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
          onClick={handleUpdateClick} // Llama a la función que incluye el console.log
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
