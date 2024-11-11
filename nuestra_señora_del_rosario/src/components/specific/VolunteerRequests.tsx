import { useState } from 'react';
import { useVolunteerRequests } from '../../hooks/useVolunteerRequests';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useFilteredRequests } from '../../hooks/useFilteredRequests';
import { VolunteerRequest } from '../../types/VolunteerType';
import { useStatuses } from '../../hooks/useStatuses';
import { useVolunteerTypes } from '../../hooks/useVolunteerTypes';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../../styles/Style.css';
import { useUpdateVolunteerStatus } from '../../hooks/useVolunteerStatusUpdate ';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function VolunteerRequests() {
  const { isDarkMode } = useThemeDark();
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 5; // Número de voluntarios por página
  const { data, isLoading, error } = useVolunteerRequests(pageNumber, pageSize);
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<'Aceptada' | 'Rechazada' | 'Pendiente' | 'Todas'>('Todas');
  const [filterType, setFilterType] = useState<string>('Todas');

  const { mutate: updateVolunteerStatus } = useUpdateVolunteerStatus();
  const filteredRequests = useFilteredRequests(data?.formVoluntaries || [], filterStatus, filterType);
  const { data: statuses, isLoading: isStatusesLoading } = useStatuses();
  const { data: volunteerTypes, isLoading: isVolunteerTypesLoading } = useVolunteerTypes();

  // Función para aceptar una solicitud
  const handleAccept = (volunteer: VolunteerRequest) => {
    updateVolunteerStatus({ id_FormVoluntarie: volunteer.id_FormVoluntarie, id_Status: 2 });
    setSelectedVolunteer(null);
  };

  // Función para rechazar una solicitud
  const handleReject = (volunteer: VolunteerRequest) => {
    updateVolunteerStatus({ id_FormVoluntarie: volunteer.id_FormVoluntarie, id_Status: 3 });
    setSelectedVolunteer(null);
  };

  // Función para ver más información
  const handleViewDetails = (volunteer: VolunteerRequest) => {
    setSelectedVolunteer(volunteer);
  };

  // Paginación
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

  if (error) {
    return <div>Error loading volunteer requests</div>;
  }

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'} rounded-[20px] shadow-2xl relative`}>
      <h2 className={`text-3xl font-bold mb-8 text-center font-poppins ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Solicitudes de Voluntarios
      </h2>

      {/* Filtros */}
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          {isStatusesLoading ? (
            [...Array(4)].map((_, i) => (
              <Skeleton key={i} width={100} height={40} className="rounded-full" />
            ))
          ) : (
            statuses?.map((status) => (
              <button
                key={status.id_Status}
                className={`px-4 py-2 rounded-full ${filterStatus === status.status_Name ? 'bg-gray-700 text-white' : 'bg-gray-300'}`}
                onClick={() => setFilterStatus(status.status_Name as 'Aceptada' | 'Rechazada' | 'Pendiente' | 'Todas')}
              >
                {status.status_Name}
              </button>
            ))
          )}
          {isStatusesLoading ? (
            <Skeleton width={100} height={40} className="rounded-full" />
          ) : (
            <button className="px-4 py-2 rounded-full bg-gray-500 text-white" onClick={() => setFilterStatus('Todas')}>
              Todas
            </button>
          )}
        </div>
        <div>
          {isVolunteerTypesLoading ? (
            <Skeleton width={200} height={40} className="rounded-full" />
          ) : (
            <select
              className="px-4 py-2 border rounded-full bg-gray-200"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="Todas">Tipos de Voluntariado</option>
              {volunteerTypes?.map((type) => (
                <option key={type.id_VoluntarieType} value={type.name_voluntarieType}>
                  {type.name_voluntarieType}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent rounded-lg shadow-md">
          <thead>
            <tr className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} text-center`}>
              <th className="p-4">Nombre</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Fecha Inicio</th>
              <th className="p-4">Fecha Fin</th>
              <th className="p-4">Estatus</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="p-4"><Skeleton height={20} width="80%" /></td>
                  <td className="p-4"><Skeleton height={20} width="70%" /></td>
                  <td className="p-4"><Skeleton height={20} width="60%" /></td>
                  <td className="p-4"><Skeleton height={20} width="60%" /></td>
                  <td className="p-4"><Skeleton height={20} width="70%" /></td>
                  <td className="p-4"><Skeleton height={40} width={100} className="rounded-full" /></td>
                </tr>
              ))
            ) : (
              filteredRequests.map((request) => (
                <tr
                  key={request.id_FormVoluntarie}
                  className={`${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
                >
                  <td className={`p-4 ${request.status_Name === 'Rechazada' ? 'text-red-500' : isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {`${request.vn_Name} ${request.vn_Lastname1} ${request.vn_Lastname2}`}
                  </td>
                  <td className="p-4">{request.name_voluntarieType}</td>
                  <td className="p-4">{new Date(request.delivery_Date).toLocaleDateString()}</td>
                  <td className="p-4">{new Date(request.end_Date).toLocaleDateString()}</td>
                  <td className="p-4"><span className={"px-3 py-2 rounded-xl "}>{request.status_Name}</span></td>
                  <td className="p-4">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-200"
                      onClick={() => handleViewDetails(request)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className="flex justify-center items-center mt-4 space-x-4">
  <button
    onClick={handlePreviousPage}
    disabled={pageNumber === 1}
    className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300"
  >
    <FaArrowLeft />
  </button>

  <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
    Página {pageNumber} de {data?.totalPages}
  </span>

  <button
    onClick={handleNextPage}
    disabled={pageNumber === data?.totalPages}
    className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300"
  >
    <FaArrowRight />
  </button>
</div>

      {/* Modal de detalles */}
      {selectedVolunteer && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white text-3xl font-bold"
              onClick={() => setSelectedVolunteer(null)}
            >
              &times;
            </button>
            <h3 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
              {selectedVolunteer.vn_Name} {selectedVolunteer.vn_Lastname1} {selectedVolunteer.vn_Lastname2}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-lg text-gray-700 dark:text-gray-300">
              <div><p><strong>Email:</strong> {selectedVolunteer.vn_Email}</p></div>
              <div><p><strong>Teléfono:</strong> {selectedVolunteer.vn_Phone}</p></div>
              <div><p><strong>Fecha de Inicio:</strong> {new Date(selectedVolunteer.delivery_Date).toLocaleDateString()}</p></div>
              <div><p><strong>Fecha de Fin:</strong> {new Date(selectedVolunteer.end_Date).toLocaleDateString()}</p></div>
              <div><p><strong>Estatus:</strong><span className={"px-3 py-1 ml-2 "}>{selectedVolunteer.status_Name}</span></p></div>
              <div><p><strong>Tipo de Voluntario:</strong> {selectedVolunteer.name_voluntarieType}</p></div>
            </div>
            <div className="flex justify-center space-x-4 mt-8">
              <button
                className="px-7 py-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
                onClick={() => handleReject(selectedVolunteer)}
                tabIndex={-1}
              >
                Rechazar
              </button>
              <button
                className="px-7 py-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
                onClick={() => handleAccept(selectedVolunteer)}
                tabIndex={0}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VolunteerRequests;
