import React from 'react';
import { useEmployee } from '../../hooks/useEmployee';
import { useNavigate } from 'react-router-dom';
import { useThemeDark } from '../../hooks/useThemeDark';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const EmployeeList: React.FC = () => {
  const { data: employees = [], isLoading, error } = useEmployee();
  const navigate = useNavigate();

  const { isDarkMode } = useThemeDark();

  if (error) return <p>Error al cargar los empleados: {`${error}`}</p>;

  const handleGenerateReceipt = (employee: any) => {
    navigate(`/dashboard/comprobante-pago`, { state: { employee } });
  };

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'}`}>
      <h2 className={`text-3xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Lista de Empleados
      </h2>

      <div className="overflow-x-auto">
        <table className={`min-w-full rounded-lg shadow-md ${isDarkMode ? 'bg-gray-700' : 'bg-transparent'}`}>
          <thead>
            <tr className={`text-center ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}>
              <th className="p-4">Nombre</th>
              <th className="p-4">Cédula</th>
              <th className="p-4">Correo</th>
              <th className="p-4">Profesión</th>
              <th className="p-4">Teléfono</th>
              <th className="p-4">Acción</th>
            </tr>
          </thead>
          <tbody className={`text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {isLoading ? (
              // Mostrar Skeleton mientras se cargan los datos
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="p-4">
                    <Skeleton
                      height={20}
                      width="80%"
                      baseColor={isDarkMode ? '#2d2d2d' : '#e0e0e0'}
                      highlightColor={isDarkMode ? '#3d3d3d' : '#f5f5f5'}
                    />
                  </td>
                  <td className="p-4">
                    <Skeleton
                      height={20}
                      width="70%"
                      baseColor={isDarkMode ? '#2d2d2d' : '#e0e0e0'}
                      highlightColor={isDarkMode ? '#3d3d3d' : '#f5f5f5'}
                    />
                  </td>
                  <td className="p-4">
                    <Skeleton
                      height={20}
                      width="80%"
                      baseColor={isDarkMode ? '#2d2d2d' : '#e0e0e0'}
                      highlightColor={isDarkMode ? '#3d3d3d' : '#f5f5f5'}
                    />
                  </td>
                  <td className="p-4">
                    <Skeleton
                      height={20}
                      width="70%"
                      baseColor={isDarkMode ? '#2d2d2d' : '#e0e0e0'}
                      highlightColor={isDarkMode ? '#3d3d3d' : '#f5f5f5'}
                    />
                  </td>
                  <td className="p-4">
                    <Skeleton
                      height={20}
                      width="60%"
                      baseColor={isDarkMode ? '#2d2d2d' : '#e0e0e0'}
                      highlightColor={isDarkMode ? '#3d3d3d' : '#f5f5f5'}
                    />
                  </td>
                  <td className="p-4">
                    <Skeleton
                      height={40}
                      width={100}
                      baseColor={isDarkMode ? '#2d2d2d' : '#e0e0e0'}
                      highlightColor={isDarkMode ? '#3d3d3d' : '#f5f5f5'}
                      className="rounded-full"
                    />
                  </td>
                </tr>
              ))
            ) : (
              employees.map((employee) => (
                <tr key={employee.dni} className={`${isDarkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-white hover:bg-gray-200'}`}>
                  <td className="p-4">{employee.firstName} {employee.lastName1}</td>
                  <td className="p-4">{employee.dni}</td>
                  <td className="p-4">{employee.email}</td>
                  <td className="p-4">{employee.professionName}</td>
                  <td className="p-4">{employee.phoneNumber}</td>
                  <td className="p-4 text-center">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                      onClick={() => handleGenerateReceipt(employee)}
                    >
                      Generar Comprobante
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
