import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployee } from '../../hooks/useEmployee';
import { useFilterEmployees } from '../../hooks/useFilterEmployees';
import { useThemeDark } from '../../hooks/useThemeDark';
import SearchInput from '../common/SearchInput';
import 'react-loading-skeleton/dist/skeleton.css';
import ReusableTableRequests from '../microcomponents/ReusableTableRequests';
import { EmployeeFilterDTO } from '../../services/EmployeeService';
import EditEmployeeModal from '../microcomponents/EdiitEmployeeModal';

const EmployeeList: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingDni, setEditingDni] = useState<number | null>(null);

  // Estado para el filtro local
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  // Hook para obtener todos los empleados paginados
  const { data, isLoading, error } = useEmployee(pageNumber, pageSize);
  
  // Hook para filtrar empleados
  const { 
    employees: filteredEmployees, 
    totalPages: filteredTotalPages, 
    loading: filterLoading,
    filterEmployees
  } = useFilterEmployees();

  const navigate = useNavigate();
  const { isDarkMode } = useThemeDark();

  // Datos a mostrar
  const displayData = useMemo(() => {
    if (isFiltering) {
      return filteredEmployees;
    }
    return data?.employees || [];
  }, [isFiltering, filteredEmployees, data]);

  // Total de páginas
  const totalPagesCount = useMemo(() => {
    if (isFiltering) {
      return filteredTotalPages;
    }
    return data?.totalPages || 1;
  }, [isFiltering, filteredTotalPages, data]);

  // Función para crear el filtro basado en el término de búsqueda
  const createFilter = (term: string): EmployeeFilterDTO => {
    const filter: EmployeeFilterDTO = {};
    
    // Comprobar si es un número - será considerado como DNI
    if (/^\d+$/.test(term.trim())) {
      console.log('Filtrando por DNI:', parseInt(term.trim()));
      filter.Dni = parseInt(term.trim(), 10);
    } else {
      // Si no es solo números, asumimos que es nombre
      console.log('Filtrando por nombre:', term.trim());
      filter.First_Name = term.trim();
    }
    
    return filter;
  };

  // Efecto para manejar la búsqueda con debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        // Si hay texto de búsqueda, activamos el filtrado
        setIsFiltering(true);
        const filter = createFilter(searchTerm);
        filterEmployees(filter, pageNumber, pageSize);
      } else {
        // Si no hay texto, desactivamos el filtrado
        setIsFiltering(false);
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Efecto separado para la paginación cuando está en modo filtrado
  useEffect(() => {
    if (isFiltering && searchTerm.trim()) {
      const filter = createFilter(searchTerm);
      filterEmployees(filter, pageNumber, pageSize);
    }
    // Solo se ejecuta cuando cambia la página y estamos en modo filtrado
  }, [pageNumber, pageSize, isFiltering]);

  if (error) {
    return <p>Error al cargar los empleados: {`${error.message}`}</p>;
  }

  // Función para navegar al comprobante de pago
  const handleGenerateReceipt = (employee: any) => {
    navigate(`/dashboard/comprobante-pago`, {
      state: {
        id_Employee: employee.id_Employee,
        name: employee.first_Name,
        lastName: employee.last_Name1,
      },
    });
  };

  // Manejadores de paginación
  const handleNextPage = () => {
    if (pageNumber < totalPagesCount) {
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
    setPageNumber(1);
  };

  const handleEditClick = (dni: number) => {
    setEditingDni(dni);
    setEditModalOpen(true);
  };

  // Determinar si se está cargando
  const loading = isFiltering ? filterLoading : isLoading;

  return (
    <div
      className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${
        isDarkMode ? 'bg-[#0D313F]' : 'bg-white'
      }`}
    >
      {/* Fila superior: Título, selector de página */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4">
        <h2
          className={`text-3xl font-bold mb-2 sm:mb-0 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Lista de empleados
        </h2>

        {/* Selector de cantidad por página */}
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

      {/* Input de búsqueda usando el componente SearchInput - Centrado */}
      <div className="flex justify-center w-full mb-6">
        <div className="w-full max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nombre o cédula"
            isDarkMode={isDarkMode}
            className="w-full"
          />
        </div>
      </div>

      {/* Tabla reutilizable */}
      <ReusableTableRequests<any>
        data={displayData}
        headers={['Nombre', 'Cédula', 'Correo', 'Profesión', 'Teléfono', 'Acción']}
        isLoading={loading}
        skeletonRows={5}
        isDarkMode={isDarkMode}
        pageNumber={pageNumber}
        totalPages={totalPagesCount}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        renderRow={(employee) => (
          <tr
            key={employee.id_Employee}
            className={`${
              isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-white text-gray-800 hover:bg-gray-200'
            }`}
          >
            <td className="p-4">
              {employee.first_Name} {employee.last_Name1}
            </td>
            <td className="p-4">{employee.dni}</td>
            <td className="p-4">{employee.email}</td>
            <td className="p-4">{employee.professionName}</td>
            <td className="p-4">{employee.phone_Number}</td>
            <td className="p-4 text-center">
              <div className='flex justify-center gap-2'>
            <button
                onClick={() => handleEditClick(employee.dni)}
                className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
              >
                Editar
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                onClick={() => handleGenerateReceipt(employee)}
              >
                Comprobante
              </button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* Mensaje cuando no hay resultados */}
      {displayData.length === 0 && searchTerm && (
        <div className="text-center mt-4">
          <p className={`mb-3 text-lg ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
            No se encontraron empleados que coincidan con "<span className="font-semibold">{searchTerm}</span>".
          </p>
        </div>
      )}

{editingDni !== null && (
        <EditEmployeeModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          dni={editingDni}
        />
      )}
    </div>
  );
};

export default EmployeeList;
