import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { useAllResidents } from '../../hooks/useAllResidents';
import { useResidents } from '../../hooks/useResidents';
import useFilterResidents from '../../hooks/useFilterResidents';
import { Resident } from '../../types/ResidentsType';
import { ResidentFilter } from '../../types/ResidentFilterType';
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
  
  // Estado para determinar si estamos en modo filtrado o no
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Para el input de búsqueda
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Hook para obtener los residentes paginados (sin filtro)
  const { 
    data: paginatedResidentsData, 
    isLoading: isLoadingPaginated, 
    error: errorPaginated 
  } = useResidents(pageNumber, pageSize);
  
  // Usamos useAllResidents solo para acciones que necesitan la lista completa
  const { data: allResidentsResponse, isLoading: isLoadingAll, error: errorAll, refetch } = useAllResidents();
  
  // Hook para filtrar residentes
  const { 
    filteredResidents, 
    loading: isLoadingFiltered, 
    error: errorFiltered, 
    filterResidents 
  } = useFilterResidents();
  
  // Estado para los inputs de filtrado
  const [filters, setFilters] = useState<ResidentFilter>({
    pageNumber: 1,
    pageSize: pageSize
  });

  // Usar useMemo para allResidents para evitar recálculos innecesarios
  const allResidents = useMemo(() => {
    return allResidentsResponse?.data || [];
  }, [allResidentsResponse]);
  
  const { data: rooms = [] } = useRoom();
  const { data: dependencyLevels = [] } = useDependencyLevel();
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { showToast, message, type } = useToast();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [idRoom, setIdRoom] = useState<number | ''>('');
  const [idDependencyLevel, setIdDependencyLevel] = useState<number | ''>('');
  const [status, setStatus] = useState<string>('Activo');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Determinar qué residentes mostrar basado en si estamos en modo filtrado o paginado
  const residentsToDisplay = useMemo(() => {
    if (isFiltering && filteredResidents) {
      return filteredResidents.residents;
    }
    
    if (paginatedResidentsData) {
      return paginatedResidentsData.residents;
    }
    
    return [];
  }, [isFiltering, filteredResidents, paginatedResidentsData]);

  // Determinar el número total de páginas
  const totalPages = useMemo(() => {
    if (isFiltering && filteredResidents) {
      return filteredResidents.totalPages;
    }
    
    if (paginatedResidentsData) {
      return paginatedResidentsData.totalPages;
    }
    
    return 1;
  }, [isFiltering, filteredResidents, paginatedResidentsData]);

  // Efecto para aplicar cambios de búsqueda con un pequeño debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        // Activar el modo de filtrado
        setIsFiltering(true);
        
        // Dividir el searchTerm para intentar extraer nombre, apellidos o cédula
        const searchParts = searchTerm.trim().split(' ');
        
        const newFilters: ResidentFilter = {
          pageNumber: 1,
          pageSize: pageSize
        };
        
        // Si hay al menos una parte, asumimos que es el nombre
        if (searchParts.length >= 1) {
          newFilters.nombre = searchParts[0];
        }
        
        // Si hay al menos dos partes, asumimos que la segunda es el primer apellido
        if (searchParts.length >= 2) {
          newFilters.apellido1 = searchParts[1];
        }
        
        // Si hay al menos tres partes, asumimos que la tercera es el segundo apellido
        if (searchParts.length >= 3) {
          newFilters.apellido2 = searchParts[2];
        }
        
        // Si parece una cédula (solo números), lo ponemos en el campo cédula
        if (/^\d+$/.test(searchTerm.trim())) {
          newFilters.cedula = searchTerm.trim();
          // Y limpiamos el nombre si se puso ahí
          delete newFilters.nombre;
        }
        
        setFilters(newFilters);
        filterResidents(newFilters);
        setPageNumber(1);
      } else {
        // Desactivar el modo de filtrado cuando no hay término de búsqueda
        setIsFiltering(false);
        setFilters({
          pageNumber: 1,
          pageSize: pageSize
        });
      }
    }, 300); // 300ms de debounce

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Efecto para cambiar de página
  useEffect(() => {
    if (isFiltering) {
      // Si estamos filtrando, actualizamos el filtro con la nueva página
      filterResidents({
        ...filters,
        pageNumber: pageNumber
      });
    }
    // No es necesario hacer nada para el caso de paginación normal, 
    // ya que useResidents se actualiza automáticamente cuando cambia pageNumber
  }, [pageNumber, isFiltering]);

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

  // Mostrar skeleton mientras se cargan los datos
  const isLoading = isLoadingAll || isLoadingFiltered || isLoadingPaginated;
  const error = errorAll || errorFiltered || errorPaginated;

  if (isLoading && !residentsToDisplay.length) {
    return <Skeleton count={5} />;
  }

  if (error && !residentsToDisplay.length) {
    return <div>Error al cargar los residentes: {typeof error === 'object' && error ? (error as any).message || 'Error desconocido' : 'Error desconocido'}</div>;
  }

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex justify-between items-center mb-8">
        <h2 className={`text-3xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Listado de residentes</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/dashboard/solicitudesAprobadas')}
            className={`px-6 py-2 rounded-lg transition duration-200 ${isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
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

      <ReusableTableRequests<Resident>
        data={residentsToDisplay}
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
                Ver detalles
              </button>
            </td>
          </tr>
        )}
      />

      {/* Mensaje y botón para limpiar búsqueda cuando no hay resultados */}
      {residentsToDisplay.length === 0 && searchTerm && (
        <div className="text-center mt-4">
          <p className={`mb-3 text-lg ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
            No se encontraron residentes que coincidan con "<span className="font-semibold">{searchTerm}</span>".
          </p>
          <button 
            onClick={() => setSearchTerm('')} 
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            Limpiar búsqueda
          </button>
        </div>
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
