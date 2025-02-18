import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployee } from '../../hooks/useEmployee';
import { useThemeDark } from '../../hooks/useThemeDark';
import 'react-loading-skeleton/dist/skeleton.css';
import ReusableTableRequests from '../microcomponents/ReusableTableRequests';

const EmployeeList: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5); 
  const { data, isLoading, error } = useEmployee(pageNumber, pageSize);
  const navigate = useNavigate();
  const { isDarkMode } = useThemeDark();

  if (error) return <p>Error al cargar los empleados: {`${error.message}`}</p>;

  const handleGenerateReceipt = (employee: any) => {
    navigate(`/dashboard/comprobante-pago`, { state: { employeeDni: employee.dni } });
  };

  // Funciones para manejar la paginación
  const handleNextPage = () => {
    if (data && pageNumber < data.totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setPageNumber(1); 
  };

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'}`}>
    <div
  className="flex justify-between items-center mb-6"
>
  <h2 className={`text-3xl ml-80 font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
    Lista de Empleados
  </h2>

  <div className="flex items-center">
    <label
      htmlFor="pageSize"
      className={`mr-2 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
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


      {/* Tabla reutilizable */}
      <ReusableTableRequests<any>
        data={data?.employees || []}
        headers={['Nombre', 'Cédula', 'Correo', 'Profesión', 'Teléfono', 'Acción']}
        isLoading={isLoading}
        skeletonRows={5}
        isDarkMode={isDarkMode}
        pageNumber={pageNumber}
        totalPages={data?.totalPages}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        renderRow={(employee) => (
          <tr
            key={employee.dni}
            className={`${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
          >
            <td className="p-4">{employee.first_Name} {employee.last_Name1}</td>
            <td className="p-4">{employee.dni}</td>
            <td className="p-4">{employee.email}</td>
            <td className="p-4">{employee.professionName}</td>
            <td className="p-4">{employee.phone_Number}</td>
            <td className="p-4 text-center">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                onClick={() => handleGenerateReceipt(employee)}
              >
                Generar Comprobante
              </button>
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default EmployeeList;
