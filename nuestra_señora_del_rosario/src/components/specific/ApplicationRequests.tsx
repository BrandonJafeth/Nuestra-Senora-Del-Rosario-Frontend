import { useState } from 'react';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useStatuses } from '../../hooks/useStatuses';
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from 'react-loading-skeleton';
import { ApplicationRequest } from '../../types/ApplicationType';
import '../../styles/Style.css';
import { useUpdateApplicationStatus } from '../../hooks/useUpdateApplicationStatus';
import { useAplicationRequests } from '../../hooks/useApplication';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
import ReusableTableRequests from '../microcomponents/ReusableTableRequests';
import ReusableModalRequests from '../microcomponents/ReusableModalRequests';
import { useDeleteApplicationRequest } from '../../hooks/useDeleteApplication';
import ConfirmationModal from '../microcomponents/ConfirmationModal';
import LoadingSpinner from '../microcomponents/LoadingSpinner';

function ApplicationRequests() {
  const { isDarkMode } = useThemeDark();
  const [pageNumber, setPageNumber] = useState(1); 
  const [pageSize, setPageSize] = useState(5);
  const { data, isLoading, error } = useAplicationRequests(pageNumber, pageSize);
  const [confirmDelete, setConfirmDelete] = useState<ApplicationRequest | null>(null);
  const { mutate: deleteApplication, isLoading: isDeleting } = useDeleteApplicationRequest();
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<'Aprobado' | 'Rechazado' | 'Pendiente' | 'Todas'>('Todas');
  const { showToast, message, type } = useToast();
  const { mutate: updateApplicationStatus } = useUpdateApplicationStatus();
  const { data: statuses, isLoading: isStatusesLoading } = useStatuses();

  // Filtros para las solicitudes
  const filteredRequests = Array.isArray(data?.forms)
    ? data.forms.filter((request) => filterStatus === 'Todas' || request.status_Name === filterStatus)
    : [];

  // Si hay un error al cargar las solicitudes
  if (error) {
    return <div>Error loading application requests</div>;
  }

  // Función para aceptar una solicitud
  const handleAccept = (application: ApplicationRequest) => {
    if (application.status_Name === 'Aprobado') {
      showToast('La solicitud ya está aprobada', 'warning');
      return;
    }
    updateApplicationStatus(
      { id_ApplicationForm: application.id_ApplicationForm, id_Status: 2 },
      {
        onSuccess: () => {
          setSelectedApplication(null);
          showToast('Solicitud de ingreso aceptada', 'success');
        }
      }
    ); // Estado "Aprobado"
  };
  

  // Función para rechazar una solicitud
  const handleReject = (application: ApplicationRequest) => {
    updateApplicationStatus(
      { id_ApplicationForm: application.id_ApplicationForm, id_Status: 3 },
      {
        onSuccess: () => {
          setSelectedApplication(null);
          showToast('Solicitud de ingreso rechazada', 'error');
        }
      }
    ); // Estado "Rechazado"
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

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setPageNumber(1); // Reinicia la paginación al cambiar el tamaño de página
  };

  const handleDelete = () => {
    if (!confirmDelete) return;

    deleteApplication(confirmDelete.id_ApplicationForm, {
      onSuccess: () => {
        setSelectedApplication(null);
        setConfirmDelete(null);
        showToast("Solicitud eliminada correctamente", "success");
      },
    });
  };

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'} rounded-[20px] shadow-2xl relative`}>
      <h2 className={`text-3xl font-bold mb-8 text-center font-poppins ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Solicitudes de Ingreso
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
        <div className=" flex justify-end">
        <label htmlFor="pageSize" className={`mr-2 my-1 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
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

      {/* Tabla */}
      <ReusableTableRequests<ApplicationRequest>
        data={filteredRequests}
        headers={['Nombre', 'Apellido', 'Edad', 'Domicilio', 'Fecha Solicitud', 'Estatus', 'Acciones']}
        isLoading={isLoading}
        skeletonRows={5}
        isDarkMode={isDarkMode}
        pageNumber={pageNumber}
        totalPages={data?.totalPages}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        renderRow={(request) => (
          <tr
            key={request.id_ApplicationForm}
            className={`${
              isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-200'
            }`}
          >
            <td className="px-6 py-4">{request.name_AP}</td>
            <td className="px-6 py-4">{request.lastName1_AP}</td>
            <td className="px-6 py-4">{request.age_AP}</td>
            <td className="px-6 py-4">{request.location_AP}</td>
            <td className="px-6 py-4">{new Date(request.applicationDate).toLocaleDateString()}</td>
            <td className="px-6 py-4">
              <span
                className={`px-3 py-1 rounded-lg text-white ${
                  request.status_Name === 'Aprobado'
                    ? 'bg-green-500'
                    : request.status_Name === 'Rechazado'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`}
              >
                {request.status_Name}
              </span>
            </td>
            <td className="px-6 py-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
                onClick={() => setSelectedApplication(request)}
              >
                Ver Detalles
              </button>
            </td>
          </tr>
        )}
      />

      {/* Modal */}
      <ReusableModalRequests
        isOpen={!!selectedApplication}
        title="Detalles de la Solicitud"
        onClose={() => setSelectedApplication(null)}
        actions={
          <>
            {/* Botón de Aceptar SIEMPRE visible */}
            <button
              className="px-7 py-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
              onClick={() => handleAccept(selectedApplication!)}
            >
              Aceptar
            </button>
              {selectedApplication?.status_Name !== "Rechazado" && (
                <button
                  className="px-7 py-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
                  onClick={() => handleReject(selectedApplication!)}
                >
                  Rechazar
                </button>
              )}
            {selectedApplication?.status_Name === "Rechazado" && (
              <button
                className="px-7 py-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
                onClick={() => setConfirmDelete(selectedApplication)}
                disabled={isDeleting}
              >
                {isDeleting ? <LoadingSpinner/> : "Eliminar"}
              </button>
            )}

          </>
        }
      >
        {selectedApplication && (
         <>
         <p>
              <strong>Cédula:</strong> {selectedApplication.cedula_AP}
            </p>
            <p>
              <strong>Edad:</strong> {selectedApplication.age_AP}
            </p>
            <p>
              <strong>Domicilio:</strong> {selectedApplication.location_AP}
            </p>
            <p>
              <strong>Fecha de Solicitud:</strong>{' '}
              {new Date(selectedApplication.applicationDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Estatus:</strong>  <span
                    className={`px-3 py-1 ml-2 rounded-lg text-white ${
                      selectedApplication.status_Name === 'Aprobado'
                        ? 'bg-green-500'
                        : selectedApplication.status_Name === 'Rechazado'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}
                  >
                    {selectedApplication.status_Name}
                  </span>
            </p>
            <p>
              <strong>Encargado:</strong> {selectedApplication.guardianName}
            </p>
            <p>
              <strong>Teléfono Encargado:</strong> {selectedApplication.guardianPhone}
            </p>
            </>
        )}
      <ConfirmationModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar esta solicitud?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
      </ReusableModalRequests>
      <Toast message={message} type={type} />
    </div>
  );
}

export default ApplicationRequests;
