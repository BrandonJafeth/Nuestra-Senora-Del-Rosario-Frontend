import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useResidents } from '../../hooks/useResidents';
import { Resident } from '../../types/ResidentsType';
import { useThemeDark } from '../../hooks/useThemeDark';
import ReusableTableRequests from '../microcomponents/ReusableTableRequests';
import ResidentAppointments from '../microcomponents/AppointmentPrueba';


function ResidentTableMedical() {
  const { isDarkMode } = useThemeDark();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);	
  const { data, isLoading, error } = useResidents(pageNumber, pageSize);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const residentId = Number(event.currentTarget.getAttribute('data-resident-id'));
    setSelectedResidentId(residentId);
  };

  const filteredResidents = Array.isArray(data?.residents) ? data?.residents.filter((resident) =>
    `${resident.name_RD} ${resident.lastname1_RD} ${resident.cedula_RD}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  ) : [];


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

  if (isLoading) {
    return <Skeleton count={5} />;
  }

  if (error) {
    return <div>Error al cargar los residentes</div>;
  }

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setPageNumber(1); // Reinicia la paginación al cambiar el tamaño de página
  };
  
  
  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex justify-center items-center mb-8">
        <h2 className={`text-3xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Listado de Pacientes</h2>
      </div>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o cédula"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full max-w-md p-3 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 text-white focus:ring-blue-400' : 'text-gray-700 focus:ring-blue-600'}`}
        />
      </div>
      <div className="flex justify-center">
        <label htmlFor="pageSize" className={`mr-2 my-1 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Mostrar:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={handlePageSizeChange}
          className={`p-1  border rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>

      <ReusableTableRequests<Resident>
        data={filteredResidents}
        headers={['Nombre Completo', 'Cédula', 'Edad', 'Fecha Nacimiento','Fecha de Entrada', 'Acciones']}
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
            className={`text-center ${
              isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-200'
            }`}
          >
            <td className="px-6 py-4">{resident.name_RD} {resident.lastname1_RD} {resident.lastname2_RD}</td>
            <td className="px-6 py-4">{resident.cedula_RD}</td>
            <td className="px-6 py-4">{resident.edad}</td>
            <td className="px-6 py-4">{new Date(resident.fechaNacimiento).toLocaleDateString()}</td>
            <td className="px-6 py-4">{new Date(resident.entryDate).toLocaleDateString()}</td>
            <td className="px-6 py-4"> <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full text-center transition duration-200' data-resident-id={resident.id_Resident} onClick={handleClick}>Resumen</button></td>
           </tr>
        )}
      />
      {selectedResidentId && <ResidentAppointments residentId={selectedResidentId}/>}
            </div>
         
  );
}

export default ResidentTableMedical;
