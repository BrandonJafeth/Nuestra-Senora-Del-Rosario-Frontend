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

  const isFiltering = useMemo(() => {
    return filterStatus !== 'Todas';
  }, [filterStatus]);

  const { data, isLoading, error } = useAplicationRequests(pageNumber, pageSize);
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
  }, [data]);

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

  if (error) {
    return <div>Error loading application requests</div>;
  }

  const handleAccept = (application: ApplicationRequest) => {
    if (application.status_Name === 'Aprobado') {
      showToast('La solicitud ya está aprobada', 'warning');
      return;
    }
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
          showToast('Solicitud de ingreso aceptada', 'success');
        },
      }
    );
  };

  const handleSaveEdit = () => {
    if (!editingApplication) return;

    const {
      id_ApplicationForm,
      ...applicationData
    } = editingApplication;

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
          showToast('Solicitud de ingreso rechazada', 'error');
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
        Solicitudes de Ingreso
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
                  onClick={() =>
                    setFilterStatus(
                      status.status_Name as 'Aprobado' | 'Rechazado' | 'Pendiente' | 'Todas'
                    )
                  }
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
        headers={['Nombre', 'Apellido', 'Edad', 'Domicilio', 'Fecha Solicitud', 'Estatus', 'Acciones']}
        isLoading={isLoading && (!isFiltering || allApplications.length === 0)}
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
                className="px-2 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
                onClick={() => setSelectedApplication(request)}
              >
                Ver más
              </button>
              <button
                className="px-2 py-2 bg-orange-400 text-white rounded-xl hover:bg-orange-500 transition"
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
        onClose={() => setSelectedApplication(null)}
        actions={
          <>
            <button
              className="px-7 py-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
              onClick={() => selectedApplication && handleAccept(selectedApplication)}
            >
              Aceptar
            </button>
            {selectedApplication?.status_Name !== 'Rechazado' && (
              <button
                className="px-7 py-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
                onClick={() => selectedApplication && handleReject(selectedApplication)}
              >
                Rechazar
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
              <strong>Fecha de Solicitud:</strong>{' '}
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

      <ReusableModalRequests
        isOpen={!!editingApplication}
        title="Editar Solicitud"
        onClose={() => setEditingApplication(null)}
        actions={
          <div className="flex space-x-4 justify-end mt-4">
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
              <label className="font-semibold mb-1">Nombre</label>
              <input
                type="text"
                name="name_AP"
                value={editingApplication.name_AP}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Primer Apellido</label>
              <input
                type="text"
                name="lastName1_AP"
                value={editingApplication.lastName1_AP}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Segundo Apellido</label>
              <input
                type="text"
                name="lastName2_AP"
                value={editingApplication.lastName2_AP || ''}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Cédula</label>
              <input
                type="text"
                name="cedula_AP"
                value={editingApplication.cedula_AP}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Edad</label>
              <input
                type="number"
                name="age_AP"
                value={editingApplication.age_AP}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Domicilio</label>
              <input
                type="text"
                name="location_AP"
                value={editingApplication.location_AP}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Nombre del Encargado</label>
              <input
                type="text"
                name="guardianName"
                value={editingApplication.guardianName}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Primer Apellido Encargado</label>
              <input
                type="text"
                name="lastName1_AP"
                value={editingApplication.guardianLastName1}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Segundo Apellido Encargado</label>
              <input
                type="text"
                name="lastName2_AP"
                value={editingApplication.guardianLastName2 || ''}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Cédula Encargado</label>
              <input
                type="text"
                name="cedula_AP"
                value={editingApplication.guardianCedula}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Teléfono del Encargado</label>
              <input
                type="text"
                name="guardianPhone"
                value={editingApplication.guardianPhone}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Email del Encargado</label>
              <input
                type="email"
                name="guardianEmail"
                value={editingApplication.guardianEmail}
                onChange={handleInputChange}
                className={`w-full rounded-md border p-2 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-black'
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
