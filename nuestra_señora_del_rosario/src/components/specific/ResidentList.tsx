import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { useAllResidents } from '../../hooks/useAllResidents';
import { Resident } from '../../types/ResidentsType';
import { useRoom } from '../../hooks/useRoom';
import { useDependencyLevel } from '../../hooks/useDependencyLevel';
import { useUpdateResidentDetails } from '../../hooks/useUpdateResidentDetails';
import { useThemeDark } from '../../hooks/useThemeDark';
import Toast from '../common/Toast';
import { useToast } from '../../hooks/useToast';
import ReusableTableRequests from '../microcomponents/ReusableTableRequests';
import ResidentDetailsModal from '../microcomponents/ResidentDetailsModal';
import SearchInput from '../common/SearchInput';

// Helper para formatear las fechas (YYYY-MM-DD)
const formatDate = (dateString: string) => {
  return new Date(dateString).toISOString().split('T')[0];
};

function ResidentList() {
  const { isDarkMode } = useThemeDark();
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 5; // Número de residentes por página
  
  // Usamos useAllResidents para obtener todos los residentes
  const { data: allResidentsResponse, isLoading, error, refetch } = useAllResidents();
  
  // Usar useMemo para allResidents para evitar recálculos innecesarios
  const allResidents = useMemo(() => {
    return allResidentsResponse?.data || [];
  }, [allResidentsResponse]);
  
  const { data: rooms = [] } = useRoom();
  const { data: dependencyLevels = [] } = useDependencyLevel();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { showToast, message, type } = useToast();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [idRoom, setIdRoom] = useState<number | ''>('');
  const [idDependencyLevel, setIdDependencyLevel] = useState<number | ''>('');
  const [status, setStatus] = useState<string>('Activo');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Filtrar residentes por término de búsqueda en TODOS los datos
  const filteredResidents = useMemo(() => {
    if (!searchTerm.trim()) return allResidents;
    
    return allResidents.filter((resident) => {
      const searchValues = [
        resident.name_RD || '',
        resident.lastname1_RD || '',
        resident.lastname2_RD || '',
        resident.cedula_RD || ''
      ].join(' ').toLowerCase();
      
      return searchValues.includes(searchTerm.toLowerCase());
    });
  }, [allResidents, searchTerm]);

  // Paginar los resultados filtrados para mantener la consistencia de la interfaz
  const paginatedResidents = useMemo(() => {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredResidents.slice(startIndex, endIndex);
  }, [filteredResidents, pageNumber, pageSize]);

  // Calcular el número total de páginas basado en los resultados filtrados
  const totalPages = Math.ceil(filteredResidents.length / pageSize);

  // Regresar a la primera página cuando cambia el término de búsqueda
  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm]);

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
  
    try {
      await handleSubmit(updatedResidentData);
      await refetch();
  
      const updatedResident = allResidents.find(
        (resident) => resident.id_Resident === selectedResident?.id_Resident
      );
  
      if (updatedResident) {
        setSelectedResident(updatedResident);
        setIdRoom(updatedResident.id_Room ?? '');
        setIdDependencyLevel(updatedResident.id_DependencyLevel ?? '');
        setStatus(updatedResident.status ?? 'Activo');
        showToast('Residente actualizado correctamente', 'success');
  
        // Mostrar el toast por 2 segundos y luego cerrar el modal
        setTimeout(() => {
          setShowModal(false);
        }, 2000);
      }
    } catch (error) {
      showToast('Error al actualizar el residente', 'error');
    } finally {
      setIsUpdating(false);
      setIsEditing(false);
    }
  };
  
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

  if (isLoading) {
    return <Skeleton count={5} />;
  }

  if (error) {
    return <div>Error al cargar los residentes</div>;
  }

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex justify-between items-center mb-8">
        <h2 className={`text-3xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Listado de residentes</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/dashboard/solicitudesAprobadas')}
            className={`px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-800 hover:bg-blue-900'} text-white`}
          >
            Solicitudes aprobadas
          </button>
          <button
            onClick={() => navigate('/dashboard/NuevoResidente')}
            className={`px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-green-500 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white`}
          >
            Nuevo residente
          </button>
        </div>
      </div>

      <div className="flex justify-center w-full mb-6">
        <div className="w-full max-w-md">
          <SearchInput 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nombre, apellido o cédula"
            isDarkMode={isDarkMode}
            className="w-full"
          />
        </div>
      </div>

      {/* Nota informativa sobre la búsqueda */}
      <div className="text-center mb-4">
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
          Buscando en todos los residentes ({allResidents.length} registros)
        </p>
      </div>

      {filteredResidents.length === 0 && searchTerm ? (
        <div className={`text-center py-8 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
          <p className="text-xl">No se encontraron residentes que coincidan con "{searchTerm}"</p>
          <button 
            onClick={() => setSearchTerm('')} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Limpiar búsqueda
          </button>
        </div>
      ) : (
        <ReusableTableRequests<Resident>
          data={paginatedResidents}
          headers={['Nombre', 'Primer apellido', 'Segundo apellido', 'Cédula', 'Acciones']}
          isLoading={isLoading}
          skeletonRows={5}
          isDarkMode={isDarkMode}
          pageNumber={pageNumber}
          totalPages={totalPages}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
          renderRow={(resident) => (
            <tr
              key={resident.id_Resident}
              className={`text-center ${
                isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-200'
              }`}
            >
              <td className="px-6 py-4">{resident.name_RD}</td>
              <td className="px-6 py-4">{resident.lastname1_RD}</td>
              <td className="px-6 py-4">{resident.lastname2_RD}</td>
              <td className="px-6 py-4">{resident.cedula_RD}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleShowDetails(resident)}
                  className={`px-4 py-2 rounded-lg transition duration-200 ${
                    isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  Ver más detalles
                </button>
              </td>
            </tr>
          )}
        />
      )}

      <ResidentDetailsModal
        isOpen={showModal}
        resident={selectedResident}
        isEditing={isEditing}
        isUpdating={isUpdating}
        idRoom={idRoom}
        idDependencyLevel={idDependencyLevel}
        status={status}
        rooms={rooms}
        dependencyLevels={dependencyLevels}
        formatDate={formatDate}
        onClose={handleCloseDetails}
        onEdit={handleEditClick}
        onUpdate={handleUpdateClick}
        setIdRoom={setIdRoom}
        setIdDependencyLevel={setIdDependencyLevel}
        setStatus={setStatus}
        isDarkMode={isDarkMode}
      />
      <Toast message={message} type={type}/>
    </div>
  );
}

export default ResidentList;
