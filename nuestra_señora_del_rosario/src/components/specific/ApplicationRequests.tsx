import { useState, useEffect, useMemo } from 'react';
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
import { useUpdateApplicationRequest } from '../../hooks/useUpdateApplicationRequest';

function ApplicationRequests() {
  const { isDarkMode } = useThemeDark();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [allApplications, setAllApplications] = useState<ApplicationRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<'Aprobado' | 'Rechazado' | 'Pendiente' | 'Todas'>('Todas');
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isLoadingAllData, setIsLoadingAllData] = useState(false);

  const isFiltering = useMemo(() => {
    return filterStatus !== 'Todas';
  }, [filterStatus]);

  const { data, isLoading, error } = useAplicationRequests(pageNumber, pageSize);
  const { data: allData } = useAplicationRequests(1, 1000);

  const [confirmDelete, setConfirmDelete] = useState<ApplicationRequest | null>(null);
  const { mutate: deleteApplication, isLoading: isDeleting } = useDeleteApplicationRequest();

  const [selectedApplication, setSelectedApplication] = useState<ApplicationRequest | null>(null);
  const [editingApplication, setEditingApplication] = useState<ApplicationRequest | null>(null);

  const { showToast, message, type } = useToast();
  const { mutate: updateApplicationStatus } = useUpdateApplicationStatus();
  const { mutate: updateApplication, isLoading: isUpdating } = useUpdateApplicationRequest();
  const { data: statuses, isLoading: isStatusesLoading } = useStatuses();

  useEffect(() => {
    if (data?.forms) {
      if (!isFiltering) {
        setAllApplications(prevApplications => {
          const newApplications = [...prevApplications];
          data.forms.forEach(application => {
            const index = newApplications.findIndex(a => a.id_ApplicationForm === application.id_ApplicationForm);
            if (index >= 0) {
              newApplications[index] = application;
            } else {
              newApplications.push(application);
            }
          });
          return newApplications;
        });
      }
    }
  }, [data, isFiltering]);

  useEffect(() => {
    if (isFiltering && allData?.forms) {
      setAllApplications(allData.forms);
      setIsLoadingAllData(false);
    }
  }, [allData, isFiltering]);

  useEffect(() => {
    if (isFiltering) {
      setIsLoadingAllData(true);
    } else {
      setIsLoadingAllData(false);
    }
  }, [filterStatus, isFiltering]);

  useEffect(() => {
    if (isLoadingAllData) {
      const timer = setTimeout(() => {
        setIsLoadingAllData(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoadingAllData]);

  const filteredApplications = useMemo(() => {
    if (!isFiltering) return [];

    return allApplications.filter((app) =>
      filterStatus === 'Todas' || app.status_Name === filterStatus
    );
  }, [allApplications, filterStatus, isFiltering]);

  const currentApplications = useMemo(() => {
    if (!isFiltering) {
      return data?.forms || [];
    } else {
      return filteredApplications.slice(
        (pageNumber - 1) * pageSize,
        pageNumber * pageSize
      );
    }
  }, [isFiltering, data?.forms, filteredApplications, pageNumber, pageSize]);

  const totalPages = useMemo(() => {
    if (!isFiltering) return data?.totalPages || 1;
    return Math.max(1, Math.ceil(filteredApplications.length / pageSize));
  }, [isFiltering, data?.totalPages, filteredApplications.length, pageSize]);

  useEffect(() => {
    if (pageNumber > totalPages) {
      setPageNumber(Math.max(1, totalPages));
    }
  }, [totalPages, pageNumber]);

  useEffect(() => {
    setPageNumber(1);
  }, [filterStatus, pageSize]);

  const handleStatusFilterChange = (status: 'Aprobado' | 'Rechazado' | 'Pendiente' | 'Todas') => {
    setFilterStatus(status);
    setPageNumber(1);

    if (status === 'Todas') {
      setIsLoadingAllData(false);
    }
  };

  if (error) {
    return <div>Error loading application requests</div>;
  }

  const handleAccept = (application: ApplicationRequest) => {
    if (application.status_Name === 'Aprobado') {
      showToast('La solicitud ya está aprobada', 'warning');
      return;
    }

    setIsAccepting(true);
    updateApplicationStatus(
      { id_ApplicationForm: application.id_ApplicationForm, id_Status: 2 },
      {
        onSuccess: () => {
          setAllApplications(prev =>
            prev.map(app =>
              app.id_ApplicationForm === application.id_ApplicationForm
                ? { ...app, status_Name: 'Aprobado' }
                : app
            )
          );
          setSelectedApplication(null);
          setIsAccepting(false);
          showToast('Solicitud de ingreso aceptada', 'success');
        },
        onError: () => {
          showToast('Error al aceptar la solicitud', 'error');
          setIsAccepting(false);
        },
      }
    );
  };

const handleSaveEdit = () => {
  if (!editingApplication) return;

  const fieldLabels: Record<string, string> = {
    name_AP: 'Nombre',
    lastName1_AP: 'Primer Apellido',
    lastName2_AP: 'Segundo Apellido',
    age_AP: 'Edad',
    cedula_AP: 'Cédula',
    location_AP: 'Domicilio',
    guardianName: 'Nombre del Encargado',
    guardianLastName1: 'Primer Apellido del Encargado',
    guardianCedula: 'Cédula del Encargado',
    guardianPhone: 'Teléfono del Encargado',
    guardianEmail: 'Email del Encargado'
  };

  const emptyFields = Object.keys(fieldLabels).filter(
    (field) => !editingApplication[field as keyof ApplicationRequest]?.toString().trim()
  );

  if (emptyFields.length > 0) {
    const fieldNames = emptyFields.map((field) => fieldLabels[field]).join(', ');
    showToast(`Por favor, completa los siguientes campos: ${fieldNames}.`, 'warning');
    return;
  }

  const { id_ApplicationForm, ...applicationData } = editingApplication;

  updateApplication(
    {
      id: id_ApplicationForm,
      applicationData,
    },
    {
      onSuccess: () => {
        setEditingApplication(null);
        showToast('Solicitud actualizada correctamente', 'success');
      },
      onError: () => {
        showToast('Error al actualizar la solicitud', 'error');
      },
    }
  );
};


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingApplication) return;
    setEditingApplication({
      ...editingApplication,
      [e.target.name]: e.target.value,
    });
  };

  const handleReject = (application: ApplicationRequest) => {
    setIsRejecting(true);
    updateApplicationStatus(
      { id_ApplicationForm: application.id_ApplicationForm, id_Status: 3 },
      {
        onSuccess: () => {
          setAllApplications(prev =>
            prev.map(app =>
              app.id_ApplicationForm === application.id_ApplicationForm
                ? { ...app, status_Name: 'Rechazado' }
                : app
            )
          );
          setSelectedApplication(null);
          setIsRejecting(false);
          showToast('Solicitud de ingreso rechazada', 'error');
        },
        onError: () => {
          showToast('Error al rechazar la solicitud', 'error');
          setIsRejecting(false);
        },
      }
    );
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
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
    setPageNumber(1);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    deleteApplication(confirmDelete.id_ApplicationForm, {
      onSuccess: () => {
        setAllApplications(prev =>
          prev.filter(app => app.id_ApplicationForm !== confirmDelete.id_ApplicationForm)
        );
        setSelectedApplication(null);
        setConfirmDelete(null);
        showToast('Solicitud eliminada correctamente', 'success');
      },
    });
  };

  return (
    <div
      className={`w-full max-w-[1169px] mx-auto p-6 ${
        isDarkMode ? 'bg-[#0D313F]' : 'bg-white'
      } rounded-[20px] shadow-2xl relative`}
    >
      <h2
        className={`text-3xl font-bold mb-8 text-center font-poppins ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}
      >
        Solicitudes de ingreso
      </h2>

      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          {isStatusesLoading
            ? [...Array(4)].map((_, i) => (
                <Skeleton key={i} width={100} height={40} className="rounded-full" />
              ))
            : statuses?.map((status) => (
                <button
                  key={status.id_Status}
                  className={`px-4 py-2 rounded-full ${
                    filterStatus === status.status_Name
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-300'
                  }`}
                  onClick={() => handleStatusFilterChange(
                    status.status_Name as 'Aprobado' | 'Rechazado' | 'Pendiente' | 'Todas'
                  )}
                >
                  {status.status_Name}
                </button>
              ))}
          {isStatusesLoading ? (
            <Skeleton width={100} height={40} className="rounded-full" />
          ) : (
            <button
              className="px-4 py-2 rounded-full bg-gray-500 text-white"
              onClick={() => handleStatusFilterChange('Todas')}
            >
              Todas
            </button>
          )}
        </div>

        <div className="flex items-center">
          <label
            htmlFor="pageSize"
            className={`mr-2 my-1 text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            Mostrar:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className={`p-2 border rounded-lg ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      <ReusableTableRequests<ApplicationRequest>
        data={currentApplications}
        headers={['Nombre', 'Apellido', 'Edad', 'Domicilio', 'Fecha solicitud', 'Estatus', 'Acciones']}
        isLoading={(isLoading && !isFiltering) || (isLoadingAllData && isFiltering)}
        skeletonRows={5}
        isDarkMode={isDarkMode}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        renderRow={(request) => (
          <tr
            key={request.id_ApplicationForm}
            className={`${
              isDarkMode
                ? 'bg-gray-600 text-white hover:bg-gray-700'
                : 'bg-white text-gray-800 hover:bg-gray-200'
            }`}
          >
            <td className="px-6 py-4">{request.name_AP}</td>
            <td className="px-6 py-4">{request.lastName1_AP}</td>
            <td className="px-6 py-4">{request.age_AP}</td>
            <td className="px-6 py-4">{request.location_AP}</td>
            <td className="px-6 py-4">
              {new Date(request.applicationDate).toLocaleDateString()}
            </td>
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
            <td className="px-6 py-4 flex space-x-2">
              <button
                className="w-20 px-3 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
                onClick={() => setSelectedApplication(request)}
              >
                Ver más
              </button>
              <button
                className=" w-auto px-2 py-2 bg-orange-400 text-white rounded-xl hover:bg-orange-500 transition"
                onClick={() => setEditingApplication(request)}
              >
                Editar
              </button>
            </td>
          </tr>
        )}
      />

      <ReusableModalRequests
        isOpen={!!selectedApplication}
        title="Detalles de la Solicitud"
        onClose={() => !isAccepting && !isRejecting && setSelectedApplication(null)}
        actions={
          <>
            <button
              className="px-7 py-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
              onClick={() => selectedApplication && handleAccept(selectedApplication)}
              disabled={isAccepting || isRejecting}
            >
              {isAccepting ? <LoadingSpinner /> : 'Aceptar'}
            </button>
            {selectedApplication?.status_Name !== 'Rechazado' && (
              <button
                className="px-7 py-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
                onClick={() => selectedApplication && handleReject(selectedApplication)}
                disabled={isRejecting || isAccepting}
              >
                {isRejecting ? <LoadingSpinner /> : 'Rechazar'}
              </button>
            )}
            {selectedApplication?.status_Name === 'Rechazado' && (
              <button
                className="px-7 py-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
                onClick={() => setConfirmDelete(selectedApplication)}
                disabled={isDeleting}
              >
                {isDeleting ? <LoadingSpinner /> : 'Eliminar'}
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
              <strong>Fecha de solicitud:</strong>{' '}
              {new Date(selectedApplication.applicationDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Estatus:</strong>{' '}
              <span
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
              <strong>Teléfono encargado:</strong> {selectedApplication.guardianPhone}
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

      <ReusableModalRequests
        isOpen={!!editingApplication}
        title="Editar solicitud"
        onClose={() => setEditingApplication(null)}
        actions={
          <div className="flex space-x-4 justify-end">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              onClick={handleSaveEdit}
              disabled={isUpdating}
            >
              {isUpdating ? <LoadingSpinner /> : 'Guardar'}
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              onClick={() => setEditingApplication(null)}
            >
              Cancelar
            </button>
          </div>
        }
      >
        {editingApplication && (
          <>
            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
              <input
                type="text"
                name="name_AP"
                value={editingApplication.name_AP}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black-800'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">Primer apellido</label>
              <input
                type="text"
                name="lastName1_AP"
                value={editingApplication.lastName1_AP}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black-800'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className=" font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">Segundo apellido</label>
              <input
                type="text"
                name="lastName2_AP"
                value={editingApplication.lastName2_AP || ''}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black-800'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">Cédula</label>
              <input
                type="text"
                name="cedula_AP"
                value={editingApplication.cedula_AP}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black-800'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">Edad</label>
              <input
                type="number"
                name="age_AP"
                value={editingApplication.age_AP}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black-800'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">Domicilio</label>
              <input
                type="text"
                name="location_AP"
                value={editingApplication.location_AP}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black-800'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">Nombre del encargado</label>
              <input
                type="text"
                name="guardianName"
                value={editingApplication.guardianName}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black-800'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">Primer apellido encargado</label>
              <input
                type="text"
                name="guardianLastName1"
                value={editingApplication.guardianLastName1}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black-800'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">Segundo apellido encargado</label>
              <input
                type="text"
                name="guardianLastName2"
                value={editingApplication.guardianLastName2 || ''}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black-800'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">Cédula encargado</label>
              <input
                type="text"
                name="guardianCedula"
                value={editingApplication.guardianCedula}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black-800'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">Teléfono del encargado</label>
              <input
                type="text"
                name="guardianPhone"
                value={editingApplication.guardianPhone}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black-800'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">Email del encargado</label>
              <input
                type="email"
                name="guardianEmail"
                value={editingApplication.guardianEmail}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black-800'
                }`}
              />
            </div>
          </>
        )}
      </ReusableModalRequests>

      <Toast message={message} type={type} />
    </div>
  );
}

export default ApplicationRequests;
