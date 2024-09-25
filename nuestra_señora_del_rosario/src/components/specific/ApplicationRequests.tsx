import { useState } from 'react';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useStatuses } from '../../hooks/useStatuses';
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from 'react-loading-skeleton';
import { ApplicationRequest } from '../../types/ApplicationType';
import { useApplicationRequests } from '../../hooks/useApplication';
import '../../styles/Style.css'

function ApplicationRequests() {
  const { data: applicationRequests = [], isLoading, error } = useApplicationRequests();
  const { isDarkMode } = useThemeDark();
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<'Aceptada' | 'Rechazada' | 'Pendiente' | 'Todas'>('Todas');

  const statusMapping = {
    Pendiente: 'Pending',
    Aceptada: 'Approved',
    Rechazada: 'Rejected',
    Todas: 'Todas'
  };
  
  // Convertir el filtro al inglés para la comparación
  const filteredRequests = applicationRequests.filter((request) => {
    return (
      filterStatus === 'Todas' || 
      request.status_Name === statusMapping[filterStatus]
    );
  });
  
  const { data: statuses, isLoading: isStatusesLoading } = useStatuses();

  // Si hay un error al cargar las solicitudes
  if (error) {
    return <div>Error loading application requests</div>;
  }

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'} rounded-[20px] shadow-2xl relative`}>
      <h2 className={`text-3xl font-bold mb-8 text-center font-poppins ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Solicitudes de Ingreso
      </h2>

      {/* Filtros */}
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          {isStatusesLoading ? (
            // Skeleton para los botones de estado
            [...Array(4)].map((_, i) => (
              <Skeleton 
                key={i} 
                width={100} 
                height={40} 
                className="rounded-full" 
              />
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
            <Skeleton 
              width={100} 
              height={40} 
              className="rounded-full" 
            />
          ) : (
            <button
              className="px-4 py-2 rounded-full bg-gray-500 text-white"
              onClick={() => setFilterStatus('Todas')}
            >
              Todas
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent rounded-lg shadow-md">
          <thead>
            <tr className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} text-center`}>
              <th className="p-4">Nombre</th>
              <th className="p-4">Apellido</th>
              <th className="p-4">Edad</th>
              <th className="p-4">Ubicación</th>
              <th className="p-4">Fecha Solicitud</th>
              <th className="p-4">Estatus</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {isLoading ? (
              // Mostrar Skeleton manteniendo la estructura de la tabla
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="p-4">
                    <Skeleton height={20} width="80%" />
                  </td>
                  <td className="p-4">
                    <Skeleton height={20} width="70%" />
                  </td>
                  <td className="p-4">
                    <Skeleton height={20} width="60%" />
                  </td>
                  <td className="p-4">
                    <Skeleton height={20} width="60%" />
                  </td>
                  <td className="p-4">
                    <Skeleton height={20} width="70%" />
                  </td>
                  <td className="p-4">
                    <Skeleton height={20} width="50%" />
                  </td>
                  <td className="p-4">
                    <Skeleton height={40} width={100} className="rounded-full" />
                  </td>
                </tr>
              ))
            ) : (
              filteredRequests.map((request: any) => (
                <tr
                  key={request.id_ApplicationForm}
                  className={`${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
                >
                  <td className="p-4">{request.name_AP}</td>
                  <td className="p-4">{request.lastname1_AP}</td>
                  <td className="p-4">{request.age_AP}</td>
                  <td className="p-4">{request.location}</td>
                  <td className="p-4">{new Date(request.applicationDate).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={"px-3 py-2 rounded-xl "}>
                      {request.status_Name}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-200"
                      onClick={() => setSelectedApplication(request)}
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles */}
      {selectedApplication && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-lg relative">
            {/* Botón de cerrar */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white text-3xl font-bold"
              onClick={() => setSelectedApplication(null)}
            >
              &times;
            </button>
            
            {/* Título del modal */}
            <h3 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
              {selectedApplication.name_AP} {selectedApplication.lastname1_AP}
            </h3>
            
            {/* Información del solicitante */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-lg text-gray-700 dark:text-gray-300">
              <div>
                <p><strong>Cédula:</strong> {selectedApplication.cedula_AP}</p>
              </div>
              <div>
                <p><strong>Edad:</strong> {selectedApplication.age_AP}</p>
              </div>
              <div>
                <p><strong>Ubicación:</strong> {selectedApplication.location}</p>
              </div>
              <div className="truncate">
                <p><strong>Teléfono:</strong> {selectedApplication.phone_GD}</p>
              </div>
              <div>
                <p><strong>Fecha de Solicitud:</strong> {new Date(selectedApplication.applicationDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p><strong>Estatus:</strong> {selectedApplication.status_Name}</p>
              </div>
              {/* Agregar el nombre del encargado */}
              <div>
                <p><strong>Encargado:</strong> {selectedApplication.name_GD}</p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                className="px-7 py-4 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 transition duration-200"
                onClick={() => setSelectedApplication(null)}
                tabIndex={0}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationRequests;
