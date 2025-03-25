import { useState } from "react";
import { VolunteerRequest } from "../../types/VolunteerType";
import ReusableModalRequests from "../microcomponents/ReusableModalRequests";
import ReusableTableRequests from "../microcomponents/ReusableTableRequests";
import { useVolunteerRequests } from "../../hooks/useVolunteerRequests";
import { useToast } from "../../hooks/useToast";
import Toast from "../common/Toast";
import { useThemeDark } from "../../hooks/useThemeDark";
import { useStatuses } from "../../hooks/useStatuses";
import { useUpdateVolunteerStatus } from "../../hooks/useVolunteerStatusUpdate ";
import Skeleton from "react-loading-skeleton";
import { useVolunteerTypes } from "../../hooks/useVolunteerTypes";
import { useFilteredRequests } from "../../hooks/useFilteredRequests";
import { useDeleteVoluntarieRequest } from "../../hooks/useDeleteVoluntarie";
import ConfirmationModal from "../microcomponents/ConfirmationModal";

function VolunteerRequests() {
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<'Todas' | 'Aceptada' | 'Rechazada' | 'Pendiente'>('Todas');
  const [filterType, setFilterType] = useState<string>('Todas');
  const [pageSize, setPageSize] = useState(5);
  const { data, isLoading } = useVolunteerRequests(pageNumber, pageSize);
  const { data: statuses, isLoading: isStatusesLoading } = useStatuses();
  const { data: volunteerTypes, isLoading: isVolunteerTypesLoading } = useVolunteerTypes();
  const { mutate: updateVolunteerStatus } = useUpdateVolunteerStatus();
  const [confirmDelete, setConfirmDelete] = useState<VolunteerRequest | null>(null);
  const {mutate: deleteVolunteering, isLoading : isDeleting} = useDeleteVoluntarieRequest();
  const { showToast, message, type } = useToast();
  const { isDarkMode } = useThemeDark();
  
  const filteredRequests = useFilteredRequests(data?.formVoluntaries || [], filterStatus, filterType);
  const handleNextPage = () => {
    if (data && pageNumber < data.totalPages) setPageNumber(pageNumber + 1);
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const handleReject = (volunteer: VolunteerRequest) => {
    if (volunteer) {
      updateVolunteerStatus(
        { id_FormVoluntarie: volunteer.id_FormVoluntarie, id_Status: 3 },
        {
          onSuccess: () => {
            showToast("Solicitud de voluntario rechazada", "success");
            setTimeout(() => setSelectedVolunteer(null), 2000);
          },
          onError: () => {
            showToast("Error al rechazar la solicitud", "error");
          },
        }
      );
    }
  };

  const handleAccept = (volunteer: VolunteerRequest) => {
    if (volunteer.status_Name === "Aprobado") {
      showToast("Esta solicitud ya ha sido aceptada", "warning");
      return;
    } {
      updateVolunteerStatus(
        { id_FormVoluntarie: volunteer.id_FormVoluntarie, id_Status: 2 },
        {
          onSuccess: () => {
            showToast("Solicitud de voluntario aceptada", "success");
            setTimeout(() => setSelectedVolunteer(null), 2000);
          },
          onError: () => {
            showToast("Error al aceptar la solicitud", "error");
          },
        }
      );
    }
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setPageNumber(1); // Reinicia la paginación al cambiar el tamaño de página
  };

  const handleDelete = () => {
    if (!confirmDelete) return;

    deleteVolunteering(confirmDelete.id_FormVoluntarie, {
      onSuccess: () => {
        showToast("Donación eliminada correctamente", "success");
        setSelectedVolunteer(null);
        setConfirmDelete(null);
      },
    });
  };

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'} rounded-[20px] shadow-2xl relative`}>
      <h2 className={`text-3xl font-bold mb-8 text-center font-poppins ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Solicitudes de Voluntarios</h2>
  




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

        <div className="flex justify-end gap-4">
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

  <div className="flex items-center">
    <label
      htmlFor="pageSize"
      className={`mr-2 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
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
      </div>


      {/* Tabla */}
    <ReusableTableRequests<VolunteerRequest>
  data={filteredRequests}
  headers={["Nombre", "Tipo", "Fecha Inicio", "Fecha Fin", "Estatus", "Acciones"]}
  isLoading={isLoading}
  skeletonRows={5}
  isDarkMode={isDarkMode}
  pageNumber={pageNumber}
  totalPages={data?.totalPages}
  onNextPage={handleNextPage}
  onPreviousPage={handlePreviousPage}
  renderRow={(volunteer) => (
    <tr
      key={volunteer.id_FormVoluntarie}
      className={`${
        isDarkMode ? "bg-gray-600 text-white hover:bg-gray-700" : "bg-white text-gray-800 hover:bg-gray-200"
      }`}
    >
      <td className="px-6 py-4">{`${volunteer.vn_Name} ${volunteer.vn_Lastname1} ${volunteer.vn_Lastname2}`}</td>
      <td className="px-6 py-4">{volunteer.name_voluntarieType}</td>
      <td className="px-6 py-4">{new Date(volunteer.delivery_Date).toLocaleDateString()}</td>
      <td className="px-6 py-4">{new Date(volunteer.end_Date).toLocaleDateString()}</td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-lg text-white ${
            volunteer.status_Name === "Aprobado"
              ? "bg-green-500"
              : volunteer.status_Name === "Rechazado"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        >
          {volunteer.status_Name}
        </span>
      </td>
      <td className="px-6 py-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-200"
          onClick={() => setSelectedVolunteer(volunteer)}
        >
          Editar
        </button>
      </td>
    </tr>
  )}
/>


      {/* Modal */}
      <ReusableModalRequests
        isOpen={!!selectedVolunteer}
        title="Detalles del Voluntario"
        onClose={() => setSelectedVolunteer(null)}
        actions={
          <>
          {/* Botón de Aceptar SIEMPRE visible */}
          <button
            className="px-7 py-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
            onClick={() => handleAccept(selectedVolunteer!)}
          >
            Aceptar
          </button>
            {selectedVolunteer?.status_Name !== "Rechazado" && (
            <button
              className="px-7 py-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
              onClick={() => handleReject(selectedVolunteer!)}
            >
              Rechazar
            </button>
          )}
          {selectedVolunteer?.status_Name === "Rechazado" && (
            <button
              className="px-7 py-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
              onClick={() => setConfirmDelete(selectedVolunteer)}
              disabled={isLoading}
            >
              {isLoading ? "Eliminando..." : "Eliminar"}
            </button>
          )}
          
          </>
        }
      >
        {selectedVolunteer && (
          <>
            <p>
              <strong>Email:</strong> {selectedVolunteer.vn_Email}
            </p>
            <p>
              <strong>Teléfono:</strong> {selectedVolunteer.vn_Phone}
            </p>
            <p>
              <strong>Fecha de Inicio:</strong> {new Date(selectedVolunteer.delivery_Date).toLocaleDateString()}
            </p>
            <p>
              <strong>Fecha de Fin:</strong> {new Date(selectedVolunteer.end_Date).toLocaleDateString()}
            </p>
            <p>
              <strong>Estatus:</strong> <span
                    className={`px-3 py-1 ml-2 rounded-lg text-white ${
                      selectedVolunteer.status_Name === 'Aprobado'
                        ? 'bg-green-500'
                        : selectedVolunteer.status_Name === 'Rechazado'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}
                  >
                    {selectedVolunteer.status_Name}
                  </span>
            </p>
            <p>
              <strong>Tipo de Voluntario:</strong> {selectedVolunteer.name_voluntarieType}
            </p>
          </>
        )}
        <ConfirmationModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar esta solicitud de donación?"
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
      </ReusableModalRequests>

      <Toast message={message} type={type} />
    </div>
  );
}

export default VolunteerRequests;
