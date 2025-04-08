import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { useResidents } from '../../hooks/useResidents';
import { Resident } from '../../types/ResidentsType';
import { useThemeDark } from '../../hooks/useThemeDark';
import ReusableTableRequests from '../microcomponents/ReusableTableRequests';

function ResidentTableMedical() {
  const navigate = useNavigate(); // Hook para redireccionar
  const { isDarkMode } = useThemeDark();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { data, isLoading, error } = useResidents(pageNumber, pageSize);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filtrado de residentes según el término de búsqueda
  const filteredResidents = Array.isArray(data?.residents)
    ? data?.residents.filter((resident) =>
        `${resident.name_RD} ${resident.lastname1_RD} ${resident.cedula_RD}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

  // Función para cambiar de página en la paginación
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

  if (isLoading) {
    return <Skeleton count={5} />;
  }

  if (error) {
    return <div>Error al cargar los residentes</div>;
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
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o cédula"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full max-w-md p-3 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 text-white focus:ring-blue-400' : 'text-gray-700 focus:ring-blue-600'}`}
        />

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
        data={filteredResidents}
        headers={['Nombre completo', 'Cédula', 'Edad', 'Fecha nacimiento', 'Fecha de entrada', 'Acciones']}
        isLoading={isLoading}
        skeletonRows={5}
        isDarkMode={isDarkMode}
        pageNumber={pageNumber}
        totalPages={data?.totalPages}
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
    </div>
  );
}

export default ResidentTableMedical;
