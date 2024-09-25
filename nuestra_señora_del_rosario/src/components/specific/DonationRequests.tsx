// FILE: components/DonationRequests.tsx
import { useState } from 'react';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useStatuses } from '../../hooks/useStatuses';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DonationRequest } from '../../types/DonationType';
import { useUpdateDonationStatus } from '../../hooks/useUpdateDonationStatus';
import { useDonationRequests } from '../../hooks/useDonation';
import { useDonationTypes } from '../../hooks/useDonationTypes'; // Importar el hook para obtener los tipos de donación
import '../../styles/Style.css';

function DonationRequests() {
  const { data: donationRequests = [], isLoading, error } = useDonationRequests();
  const { isDarkMode } = useThemeDark();
  const [selectedDonation, setSelectedDonation] = useState<DonationRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<'Aprobado' | 'Rechazado' | 'Pendiente' | 'Todas'>('Todas');
  const [filterType, setFilterType] = useState<string>('Todas'); // Filtro para el tipo de donación

  const { mutate: updateDonationStatus } = useUpdateDonationStatus();
  const { data: donationTypes, isLoading: isDonationTypesLoading } = useDonationTypes(); // Obtener los tipos de donación

  const filteredRequests = donationRequests.filter((request) => {
    return (
      (filterStatus === 'Todas' || request.status_Name === filterStatus) &&
      (filterType === 'Todas' || request.donationType === filterType) // Aplicar el filtro por tipo de donación
    );
  });

  const { data: statuses, isLoading: isStatusesLoading } = useStatuses();

  // Si hay un error al cargar las solicitudes
  if (error) {
    return <div>Error loading donation requests</div>;
  }

  // Función para aceptar una solicitud
  const handleAccept = (donation: DonationRequest) => {
    updateDonationStatus({ id_FormDonation: donation.id_FormDonation, id_Status: 2 }); // Id del estado "Aceptada"
    setSelectedDonation(null);
  };

  // Función para rechazar una solicitud
  const handleReject = (donation: DonationRequest) => {
    updateDonationStatus({ id_FormDonation: donation.id_FormDonation, id_Status: 3 }); // Id del estado "Rechazada"
    setSelectedDonation(null);
  };

  // Función para ver más información
  const handleViewDetails = (donation: DonationRequest) => {
    setSelectedDonation(donation);
  };

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'} rounded-[20px] shadow-2xl relative`}>
      <h2 className={`text-3xl font-bold mb-8 text-center font-poppins ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Solicitudes de Donaciones
      </h2>

      {/* Filtros */}
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          {isStatusesLoading ? (
            // Skeleton para los botones de estado
            [...Array(4)].map((_, i) => (
              <Skeleton key={i} width={100} height={40} className="rounded-full" />
            ))
          ) : (
            statuses?.map((status) => (
              <button
                key={status.id_Status}
                className={`px-4 py-2 rounded-full ${filterStatus === status.status_Name ? 'bg-gray-700 text-white' : 'bg-gray-300'}`}
                onClick={() => setFilterStatus(status.status_Name as 'Aprobado' | 'Rechazado' | 'Pendiente' | 'Todas')}
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
          {isDonationTypesLoading ? (
            // Skeleton para el dropdown de tipos de donaciones
            <Skeleton width={200} height={40} className="rounded-full" />
          ) : (
            <select
              className="px-4 py-2 border rounded-full bg-gray-200"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="Todas">Tipos de Donación</option>
              {donationTypes?.map((type) => (
                <option key={type.id_DonationType} value={type.name_DonationType}>
                  {type.name_DonationType}
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
              <th className="p-4">Tipo de Donación</th>
              <th className="p-4">Método</th>
              <th className="p-4">Fecha</th>
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
                    <Skeleton height={40} width={100} className="rounded-full" />
                  </td>
                </tr>
              ))
            ) : (
              filteredRequests.map((request: DonationRequest) => (
                <tr
                  key={request.id_FormDonation}
                  className={`${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
                >
                  <td className="p-4">{`${request.dn_Name} ${request.dn_Lastname1} ${request.dn_Lastname2}`}</td>
                  <td className="p-4">{request.donationType}</td>
                  <td className="p-4">{request.methodDonation}</td>
                  <td className="p-4">{new Date(request.delivery_date).toLocaleDateString()}</td>
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles */}
      {selectedDonation && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-lg relative">
            {/* Botón de cerrar */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white text-3xl font-bold"
              onClick={() => setSelectedDonation(null)}
            >
              &times;
            </button>

            {/* Título del modal */}
            <h3 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
              {selectedDonation.dn_Name} {selectedDonation.dn_Lastname1} {selectedDonation.dn_Lastname2}
            </h3>

            {/* Información del donante */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-lg text-gray-700 dark:text-gray-300">
              <div>
                <p><strong>Cédula:</strong> {selectedDonation.dn_Cedula}</p>
              </div>
              <div>
                <p><strong>Email:</strong> {selectedDonation.dn_Email}</p>
              </div>
              <div>
                <p><strong>Teléfono:</strong> {selectedDonation.dn_Phone}</p>
              </div>
              <div>
                <p><strong>Fecha de Donación:</strong> {new Date(selectedDonation.delivery_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p><strong>Tipo de Donación:</strong> {selectedDonation.donationType}</p>
              </div>
              <div>
                <p><strong>Método:</strong> {selectedDonation.methodDonation}</p>
              </div>
              <div>
                <p><strong>Estatus:</strong> {selectedDonation.status_Name}</p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                className="px-7 py-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
                onClick={() => handleReject(selectedDonation)}
                tabIndex={-1}
              >
                Rechazar
              </button>
              <button
                className="px-7 py-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
                onClick={() => handleAccept(selectedDonation)}
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

export default DonationRequests;
