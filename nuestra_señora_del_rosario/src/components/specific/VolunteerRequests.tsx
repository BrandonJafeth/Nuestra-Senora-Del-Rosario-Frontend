import { useState } from 'react';
import { useVolunteerRequests } from '../../hooks/useVolunteerRequests';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useFilteredRequests } from '../../hooks/useFilteredRequests';
import { VolunteerRequest } from '../../types/VolunteerType';
import { useStatuses } from '../../hooks/useStatuses';
import { useVolunteerTypes } from '../../hooks/useVolunteerTypes';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import '../../styles/Style.css';
import { useUpdateVolunteerStatus } from '../../hooks/useVolunteerStatusUpdate ';


function VolunteerRequests() {
  
  const { data: volunteerRequests = [], isLoading, error } = useVolunteerRequests();
  const { isDarkMode } = useThemeDark();
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<'Aceptada' | 'Rechazada' | 'Pendiente' | 'Todas'>('Todas');
  const [filterType, setFilterType] = useState<string>('Todas');

  // Hook para actualizar el estado de una solicitud
  const { mutate: updateVolunteerStatus } = useUpdateVolunteerStatus();

  const filteredRequests = useFilteredRequests(volunteerRequests, filterStatus, filterType);
  const { data: statuses, isLoading: isStatusesLoading } = useStatuses();
  const { data: volunteerTypes, isLoading: isVolunteerTypesLoading } = useVolunteerTypes();

  if (isLoading || isStatusesLoading || isVolunteerTypesLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error loading volunteer requests</div>;
  }

  if (!volunteerRequests.length) {
    return <div>No volunteer requests available</div>;
  }

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

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'} rounded-[20px] shadow-2xl relative`}>
      <h2 className={`text-3xl font-bold mb-8 text-center font-poppins ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Solicitudes de Voluntarios
      </h2>

      {/* Filtros */}
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          {statuses?.map((status) => (
            <button
              key={status.id_Status}
              className={`px-4 py-2 rounded-full ${filterStatus === status.status_Name ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
              onClick={() => setFilterStatus(status.status_Name as 'Aceptada' | 'Rechazada' | 'Pendiente' | 'Todas')}
            >
              {status.status_Name}
            </button>
          ))}
          <button className="px-4 py-2 rounded-full bg-gray-500 text-white" onClick={() => setFilterStatus('Todas')}>
            Todas
          </button>
        </div>
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
            {filteredRequests.map((request) => (
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
                <td className="p-4">
                  <span className={"px-3 py-2 rounded-xl "}>
                    {request.status_Name}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-200"
                    onClick={() => handleViewDetails(request)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles */}
      {selectedVolunteer && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-lg relative">
            {/* Botón de cerrar */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white text-3xl font-bold"
              onClick={() => setSelectedVolunteer(null)}
            >
              &times;
            </button>
            
            {/* Título del modal */}
            <h3 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
              {selectedVolunteer.vn_Name} {selectedVolunteer.vn_Lastname1} {selectedVolunteer.vn_Lastname2}
            </h3>
            
            {/* Información del voluntario en dos columnas y tres filas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-lg text-gray-700 dark:text-gray-300">
              <div>
                <p><strong>Email:</strong> {selectedVolunteer.vn_Email}</p>
              </div>
              <div>
                <p><strong>Teléfono:</strong> {selectedVolunteer.vn_Phone}</p>
              </div>
              <div>
                <p><strong>Fecha de Inicio:</strong> {new Date(selectedVolunteer.delivery_Date).toLocaleDateString()}</p>
              </div>
              <div>
                <p><strong>Fecha de Fin:</strong> {new Date(selectedVolunteer.end_Date).toLocaleDateString()}</p>
              </div>
              <div>
                <p><strong>Estatus:</strong> 
                  <span className={"px-3 py-1 ml-2 "}>
                    {selectedVolunteer.status_Name}
                  </span>
                </p>
              </div>
              <div>
                <p><strong>Tipo de Voluntario:</strong> {selectedVolunteer.name_voluntarieType}</p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200"
                onClick={() => handleReject(selectedVolunteer)}
                tabIndex={-1}
              >
                Rechazar
              </button>
              <button
                className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200"
                onClick={() => handleAccept(selectedVolunteer)}
                tabIndex={0}
              >
                Aceptar
              </button>
          {/*}    <button
                className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition duration-200"
                onClick={() => setSelectedVolunteer(null)}
              >
                Volver
              </button>*/}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VolunteerRequests;
