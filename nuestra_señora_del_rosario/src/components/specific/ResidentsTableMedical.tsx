import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { useResidents } from '../../hooks/useResidents';
import useFilterResidents from '../../hooks/useFilterResidents';
import { Resident } from '../../types/ResidentsType';
import { ResidentFilter } from '../../types/ResidentFilterType';
import { useThemeDark } from '../../hooks/useThemeDark';
import ReusableTableRequests from '../microcomponents/ReusableTableRequests';
import SearchInput from '../common/SearchInput';

function ResidentTableMedical() {
  const navigate = useNavigate(); // Hook para redireccionar
  const { isDarkMode } = useThemeDark();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
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
  }, [searchTerm, pageSize]);

  // Efecto para cambiar de página
  useEffect(() => {
    if (isFiltering) {
      // Si estamos filtrando, actualizamos el filtro con la nueva página
      filterResidents({
        ...filters,
        pageNumber: pageNumber
      });
    }
    // Para paginación normal, useResidents se actualiza automáticamente
  }, [pageNumber, isFiltering]);

  // Efecto para actualizar los filtros cuando cambia el tamaño de página
  useEffect(() => {
    if (isFiltering) {
      const updatedFilters = {
        ...filters,
        pageSize: pageSize,
        pageNumber: 1 // Resetear a la primera página al cambiar el tamaño
      };
      setFilters(updatedFilters);
      filterResidents(updatedFilters);
    }
    setPageNumber(1); // Siempre volver a la primera página al cambiar el pageSize
  }, [pageSize]);

  // Función para cambiar de página en la paginación
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

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
  };

  // Mostrar skeleton mientras se cargan los datos
  const isLoading = isLoadingPaginated || isLoadingFiltered;
  const error = errorPaginated || errorFiltered;

  if (isLoading && !residentsToDisplay.length) {
    return <Skeleton count={5} />;
  }

  if (error && !residentsToDisplay.length) {
    return <div>Error al cargar los residentes: {typeof error === 'string' ? error : ((error as any)?.message || 'Error desconocido')}</div>;
  }

  // 🔹 Función para redirigir a la pantalla de detalles del residente
  const handleViewResidentDetail = (residentId: number) => {
    navigate(`/dashboard/residente-info/${residentId}`);
  };

  // 🔹 Función para redirigir al historial médico del residente
  const handleViewMedicalHistory = (residentId: number) => {
    navigate(`/dashboard/historial-medico/${residentId}`);
  };

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'}`}>
      
      {/* 🔹 FILA SUPERIOR: Título, Búsqueda y Selección de Páginas */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Listado de pacientes
        </h2>

        {/* 🔍 Búsqueda */}
        <div className="w-full max-w-md">
          <SearchInput 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nombre, apellido o cédula"
            isDarkMode={isDarkMode}
            className="w-full"
          />
        </div>

        {/* 🔹 Selección de cantidad por página */}
        <div className="flex items-center">
          <label htmlFor="pageSize" className={`mr-2 text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Mostrar:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className={`p-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      {/* 🔹 TABLA DE RESIDENTES */}
      <ReusableTableRequests<Resident>
        data={residentsToDisplay}
        headers={['Nombre completo', 'Cédula', 'Edad', 'Fecha nacimiento', 'Fecha de entrada', 'Acciones']}
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
            className={`text-center ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
          >
            <td className="px-6 py-4">{resident.name_RD} {resident.lastname1_RD} {resident.lastname2_RD}</td>
            <td className="px-6 py-4">{resident.cedula_RD}</td>
            <td className="px-6 py-4">{resident.edad}</td>
            <td className="px-6 py-4">{new Date(resident.fechaNacimiento).toLocaleDateString()}</td>
            <td className="px-6 py-4">{new Date(resident.entryDate).toLocaleDateString()}</td>
            <td className="px-6 py-4 flex flex-row gap-2">
              {/* 🔹 Botón para ver detalles */}
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full text-center transition duration-200"
                onClick={() => handleViewResidentDetail(resident.id_Resident)}
              >
                Resumen
              </button>

              {/* 🏥 Botón para ver historial médico */}
              <button
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg w-full text-center transition duration-200"
                onClick={() => handleViewMedicalHistory(resident.id_Resident)}
              >
                Historial
              </button>
            </td>
          </tr>
        )}
      />

      {/* Mensaje cuando no hay resultados */}
      {residentsToDisplay.length === 0 && searchTerm && (
        <div className="text-center mt-4">
          <p className={`mb-3 text-lg ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
            No se encontraron pacientes que coincidan con "<span className="font-semibold">{searchTerm}</span>".
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
    </div>
  );
}

export default ResidentTableMedical;
