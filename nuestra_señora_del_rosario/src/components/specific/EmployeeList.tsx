import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployee } from '../../hooks/useEmployee';
import { useThemeDark } from '../../hooks/useThemeDark';
import 'react-loading-skeleton/dist/skeleton.css';
import ReusableTableRequests from '../microcomponents/ReusableTableRequests';

const EmployeeList: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Estado para el filtro local
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useEmployee(pageNumber, pageSize);
  const navigate = useNavigate();
  const { isDarkMode } = useThemeDark();

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
    if (data && pageNumber < data.totalPages) {
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

  // Filtrar empleados de la página actual (data?.employees) por nombre, apellido o cédula
  const filteredEmployees = React.useMemo(() => {
    if (!data?.employees) return [];
    return data.employees.filter((emp: any) => {
      const fullName = `${emp.first_Name} ${emp.last_Name1} ${emp.dni}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm]);

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

      {/* Input de búsqueda */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o cédula"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full max-w-md p-3 border rounded-lg focus:outline-none focus:ring-2 ${
            isDarkMode
              ? 'bg-gray-700 text-white focus:ring-blue-400'
              : 'bg-white text-gray-700 focus:ring-blue-600'
          }`}
        />
      </div>

      {/* Tabla reutilizable */}
      <ReusableTableRequests<any>
        data={filteredEmployees} // Pasamos la lista filtrada
        headers={['Nombre', 'Cédula', 'Correo', 'Profesión', 'Teléfono', 'Acción']}
        isLoading={isLoading}
        skeletonRows={5}
        isDarkMode={isDarkMode}
        pageNumber={pageNumber}
        totalPages={data?.totalPages || 1}
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
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                onClick={() => handleGenerateReceipt(employee)}
              >
                Generar comprobante
              </button>
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default EmployeeList;
