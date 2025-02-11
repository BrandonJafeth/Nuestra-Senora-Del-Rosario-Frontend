import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { useApprovedRequests } from '../../hooks/useApprovedRequests';
import { useDependencyLevel } from '../../hooks/useDependencyLevel';
import { useRoom } from '../../hooks/useRoom';
import { ApplicationRequest } from '../../types/ApplicationType';
import { useThemeDark } from '../../hooks/useThemeDark';
import { FaArrowLeft } from 'react-icons/fa';
import ReusableTableRequests from '../microcomponents/ReusableTableRequests';
import CompleteInformationForm from '../microcomponents/CompleteInfoForm';

function ApprovedRequests() {
  const { isDarkMode } = useThemeDark();
  const navigate = useNavigate();

  // Paginación
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 5;
  const { approvedRequests = [], isLoading, error, totalPages } = useApprovedRequests({ page: pageNumber, pageSize });
  
  const { data: rooms = [] } = useRoom();
  const { data: dependencyLevels = [] } = useDependencyLevel();

  const [selectedRequest, setSelectedRequest] = useState<ApplicationRequest | null>(null);

  // Manejo de navegación
  const handleNextPage = () => pageNumber < totalPages && setPageNumber(pageNumber + 1);
  const handlePreviousPage = () => pageNumber > 1 && setPageNumber(pageNumber - 1);
  const navigateBack = () => navigate('/dashboard/residentes');

  // Manejo de errores o cargas
  if (isLoading) return <Skeleton count={5} />;
  if (error) return <div>Error al cargar las solicitudes aprobadas</div>;

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl mt-10 ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'}`}>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={navigateBack}
          className="flex justify-start items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          <FaArrowLeft size={20} />
          <span className="text-lg font-semibold">Regresar</span>
        </button>
        <h2 className={`flex justify-end mx-8 my-3 text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Solicitudes Aprobadas
        </h2>
      </div>

      {/* Tabla reutilizable */}
      <ReusableTableRequests<ApplicationRequest>
        data={approvedRequests}
        headers={['Nombre', 'Primer Apellido', 'Cédula', 'Acciones']}
        isLoading={isLoading}
        skeletonRows={5}
        isDarkMode={isDarkMode}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        renderRow={(request) => (
          <tr
            key={request.id_ApplicationForm}
            className={`hover:bg-gray-200 text-center ${
              isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-200'
            }`}
          >
            <td className="p-4">{request.name_AP}</td>
            <td className="p-4">{request.lastName1_AP}</td>
            <td className="p-4">{request.cedula_AP}</td>
            <td className="p-4">
              <button
                onClick={() => setSelectedRequest(request)}
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                Completar Información
              </button>
            </td>
          </tr>
        )}
      />

      {/* Formulario para completar información */}
      {selectedRequest && (
        <CompleteInformationForm
          selectedRequest={selectedRequest}
          dependencyLevels={dependencyLevels}
          rooms={rooms}
          onClose={() => setSelectedRequest(null)}
        />
      )}

    </div>
  );
}

export default ApprovedRequests;