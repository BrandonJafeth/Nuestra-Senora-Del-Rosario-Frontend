import { useState } from 'react';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useStatuses } from '../../hooks/useStatuses';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DonationRequest } from '../../types/DonationType';
import { useUpdateDonationStatus } from '../../hooks/useUpdateDonationStatus';
import { useDonationTypes } from '../../hooks/useDonationTypes';
import { useDonationRequests } from '../../hooks/useDonation';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
import ReusableTableRequests from '../microcomponents/ReusableTableRequests';
import ReusableModalRequests from '../microcomponents/ReusableModalRequests';

function DonationRequests() {
  const { isDarkMode } = useThemeDark();
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 5; // Número de donaciones por página
  const { data, isLoading } = useDonationRequests(pageNumber, pageSize);
  const { data: donationTypes, isLoading: isDonationTypesLoading } = useDonationTypes();
  const { data: statuses, isLoading: isStatusesLoading } = useStatuses();
  const { mutate: updateDonationStatus } = useUpdateDonationStatus();

  const [selectedDonation, setSelectedDonation] = useState<DonationRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<'Aprobado' | 'Rechazado' | 'Pendiente' | 'Todas'>('Todas');
  const [filterType, setFilterType] = useState<string>('Todas');
  const { showToast, message, type } = useToast();

  const filteredRequests = Array.isArray(data?.donations)
    ? data.donations.filter((request) => {
        return (
          (filterStatus === 'Todas' || request.status_Name === filterStatus) &&
          (filterType === 'Todas' || request.donationType === filterType)
        );
      })
    : [];

  const handleAccept = (donation: DonationRequest) => {
    updateDonationStatus({ id_FormDonation: donation.id_FormDonation, id_Status: 2 });
    showToast('Donación aceptada exitosamente', 'success');
    setTimeout(() => setSelectedDonation(null), 2000);
  };

  const handleReject = (donation: DonationRequest) => {
    updateDonationStatus({ id_FormDonation: donation.id_FormDonation, id_Status: 3 });
    showToast('Donación rechazada exitosamente', 'error');
    setTimeout(() => setSelectedDonation(null), 2000);
  };

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

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'} rounded-[20px] shadow-xl`}>
      <h2 className={`text-3xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Solicitudes de Donaciones
      </h2>

      {/* Filtros */}
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          {isStatusesLoading
            ? [...Array(4)].map((_, i) => <Skeleton key={i} width={100} height={40} className="rounded-full" />)
            : statuses?.map((status) => (
                <button
                  key={status.id_Status}
                  className={`px-4 py-2 rounded-full ${
                    filterStatus === status.status_Name ? 'bg-gray-700 text-white' : 'bg-gray-300'
                  }`}
                  onClick={() => setFilterStatus(status.status_Name as 'Aprobado' | 'Rechazado' | 'Pendiente' | 'Todas')}
                >
                  {status.status_Name}
                </button>
              ))}
          <button
            className="px-4 py-2 rounded-full bg-gray-500 text-white"
            onClick={() => setFilterStatus('Todas')}
          >
            Todas
          </button>
        </div>
        <div>
          {isDonationTypesLoading ? (
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
      <ReusableTableRequests<DonationRequest>
        data={filteredRequests}
        headers={['Nombre', 'Tipo de Donación', 'Método', 'Fecha', 'Estatus', 'Acciones']}
        isLoading={isLoading}
        skeletonRows={5}
        isDarkMode={isDarkMode}
        pageNumber={pageNumber}
        totalPages={data?.totalPages}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        renderRow={(donation) => (
          <tr
            key={donation.id_FormDonation}
            className={`${
              isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-200'
            }`}
          >
            <td className="px-6 py-4">{`${donation.dn_Name} ${donation.dn_Lastname1} ${donation.dn_Lastname2}`}</td>
            <td className="px-6 py-4">{donation.donationType}</td>
            <td className="px-6 py-4">{donation.methodDonation}</td>
            <td className="px-6 py-4">{new Date(donation.delivery_date).toLocaleDateString()}</td>
            <td className="px-6 py-4">
              <span
                className={`px-3 py-1 rounded-lg text-white ${
                  donation.status_Name === 'Aprobado'
                    ? 'bg-green-500'
                    : donation.status_Name === 'Rechazado'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`}
              >
                {donation.status_Name}
              </span>
            </td>
            <td className="px-6 py-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
                onClick={() => setSelectedDonation(donation)}
              >
                Editar
              </button>
            </td>
          </tr>
        )}
      />

      {/* Modal */}
      <ReusableModalRequests
        isOpen={!!selectedDonation}
        title="Detalles de la Donación"
        onClose={() => setSelectedDonation(null)}
        actions={
          <>
            <button
              className="px-7 py-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
              onClick={() => handleReject(selectedDonation!)}
            >
              Rechazar
            </button>
            <button
              className="px-7 py-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
              onClick={() => handleAccept(selectedDonation!)}
            >
              Aceptar
            </button>
          </>
        }
      >
        {selectedDonation && (
          <>
            <p><strong>Cédula:</strong> {selectedDonation.dn_Cedula}</p>
            <p><strong>Email:</strong> {selectedDonation.dn_Email}</p>
            <p><strong>Teléfono:</strong> {selectedDonation.dn_Phone}</p>
            <p><strong>Fecha de Donación:</strong> {new Date(selectedDonation.delivery_date).toLocaleDateString()}</p>
            <p><strong>Tipo de Donación:</strong> {selectedDonation.donationType}</p>
            <p><strong>Estatus:</strong> <span
                    className={`px-3 py-1 ml-2 rounded-lg text-white ${
                      selectedDonation.status_Name === 'Aprobado'
                        ? 'bg-green-500'
                        : selectedDonation.status_Name === 'Rechazado'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}
                  >
                    {selectedDonation.status_Name}
                  </span></p>
            <p><strong>Método:</strong> {selectedDonation.methodDonation}</p>
            </>
        )}
      </ReusableModalRequests>

      <Toast message={message} type={type} />
    </div>
  );
}

export default DonationRequests;