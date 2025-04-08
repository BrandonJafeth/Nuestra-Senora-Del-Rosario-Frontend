import { useState, useEffect, useMemo } from "react";
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
import { useDeleteVoluntarieRequest } from "../../hooks/useDeleteVoluntarie";
import ConfirmationModal from "../microcomponents/ConfirmationModal";

function VolunteerRequests() {
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<'Todas' | 'Aceptada' | 'Rechazada' | 'Pendiente'>('Todas');
  const [filterType, setFilterType] = useState<string>('Todas');
  const [pageSize, setPageSize] = useState(5);
  const [allVolunteers, setAllVolunteers] = useState<VolunteerRequest[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<VolunteerRequest | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isLoadingAllData, setIsLoadingAllData] = useState(false);

  const isFiltering = useMemo(() => {
    return filterStatus !== 'Todas' || filterType !== 'Todas';
  }, [filterStatus, filterType]);

  const { data, isLoading } = useVolunteerRequests(pageNumber, pageSize);
  const { data: allData } = useVolunteerRequests(1, 1000);
  const { data: statuses, isLoading: isStatusesLoading } = useStatuses();
  const { data: volunteerTypes, isLoading: isVolunteerTypesLoading } = useVolunteerTypes();
  const { mutate: updateVolunteerStatus } = useUpdateVolunteerStatus();
  const { mutate: deleteVolunteering, isLoading: isDeleting } = useDeleteVoluntarieRequest();
  const { showToast, message, type } = useToast();
  const { isDarkMode } = useThemeDark();

  useEffect(() => {
    if (data?.formVoluntaries) {
      if (!isFiltering) {
        setAllVolunteers(prevVolunteers => {
          const newVolunteers = [...prevVolunteers];
          data.formVoluntaries.forEach(volunteer => {
            const index = newVolunteers.findIndex(v => v.id_FormVoluntarie === volunteer.id_FormVoluntarie);
            if (index >= 0) {
              newVolunteers[index] = volunteer;
            } else {
              newVolunteers.push(volunteer);
            }
          });
          return newVolunteers;
        });
      }
    }
  }, [data, isFiltering]);

  useEffect(() => {
    if (isFiltering && allData?.formVoluntaries) {
      setAllVolunteers(allData.formVoluntaries);
      setIsLoadingAllData(false);
    }
  }, [allData, isFiltering]);

  useEffect(() => {
    if (isFiltering) {
      setIsLoadingAllData(true);
    } else {
      setIsLoadingAllData(false);
    }
  }, [filterStatus, filterType, isFiltering]);

  useEffect(() => {
    if (isLoadingAllData) {
      const timer = setTimeout(() => {
        setIsLoadingAllData(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoadingAllData]);

  const allFilteredVolunteers = useMemo(() => {
    if (!isFiltering) return [];

    return allVolunteers.filter(volunteer => {
      return (
        (filterStatus === 'Todas' || volunteer.status_Name === filterStatus) &&
        (filterType === 'Todas' || volunteer.name_voluntarieType === filterType)
      );
    });
  }, [allVolunteers, filterStatus, filterType, isFiltering]);

  const totalFilteredPages = useMemo(() => {
    if (!isFiltering) return data?.totalPages || 1;
    return Math.max(1, Math.ceil(allFilteredVolunteers.length / pageSize));
  }, [allFilteredVolunteers, pageSize, data?.totalPages, isFiltering]);

  const currentVolunteers = useMemo(() => {
    if (!isFiltering) {
      return data?.formVoluntaries || [];
    } else {
      return allFilteredVolunteers.slice(
        (pageNumber - 1) * pageSize,
        pageNumber * pageSize
      );
    }
  }, [isFiltering, data?.formVoluntaries, allFilteredVolunteers, pageNumber, pageSize]);

  useEffect(() => {
    if (pageNumber > totalFilteredPages) {
      setPageNumber(Math.max(1, totalFilteredPages));
    }
  }, [totalFilteredPages, pageNumber]);

  useEffect(() => {
    setPageNumber(1);
  }, [filterStatus, filterType, pageSize]);

  const handleNextPage = () => {
    if (pageNumber < totalFilteredPages) setPageNumber(pageNumber + 1);
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const handleReject = (volunteer: VolunteerRequest) => {
    if (volunteer && !isRejecting && !isAccepting) {
      setIsRejecting(true);
      updateVolunteerStatus(
        { id_FormVoluntarie: volunteer.id_FormVoluntarie, id_Status: 3 },
        {
          onSuccess: () => {
            setAllVolunteers(prevVolunteers => {
              return prevVolunteers.map(v => {
                if (v.id_FormVoluntarie === volunteer.id_FormVoluntarie) {
                  return { ...v, status_Name: "Rechazado" };
                }
                return v;
              });
            });
            setSelectedVolunteer(null);
            setIsRejecting(false);
            showToast("Solicitud de voluntario rechazada", "error");
          },
          onError: () => {
            showToast("Error al rechazar la solicitud", "error");
            setIsRejecting(false);
          },
        }
      );
    }
  };

  const handleAccept = (volunteer: VolunteerRequest) => {
    if (!volunteer || isAccepting || isRejecting) return;

    if (volunteer.status_Name === "Aprobado") {
      showToast("Esta solicitud ya ha sido aceptada", "warning");
      return;
    }

    setIsAccepting(true);
    updateVolunteerStatus(
      { id_FormVoluntarie: volunteer.id_FormVoluntarie, id_Status: 2 },
      {
        onSuccess: () => {
          setAllVolunteers(prevVolunteers => {
            return prevVolunteers.map(v => {
              if (v.id_FormVoluntarie === volunteer.id_FormVoluntarie) {
                return { ...v, status_Name: "Aprobado" };
              }
              return v;
            });
          });
          setSelectedVolunteer(null);
          setIsAccepting(false);
          showToast("Solicitud de voluntario aceptada", "success");
        },
        onError: () => {
          showToast("Error al aceptar la solicitud", "error");
          setIsAccepting(false);
        },
      }
    );
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setPageNumber(1);
  };

  const handleStatusFilterChange = (status: 'Todas' | 'Aceptada' | 'Rechazada' | 'Pendiente') => {
    setFilterStatus(status);
    setPageNumber(1);

    if (status === 'Todas') {
      setIsLoadingAllData(false);
    }
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
    setPageNumber(1);

    if (e.target.value === 'Todas') {
      setIsLoadingAllData(false);
    }
  };

  const handleDelete = () => {
    if (!confirmDelete) return;

    deleteVolunteering(confirmDelete.id_FormVoluntarie, {
      onSuccess: () => {
        setAllVolunteers(prevVolunteers => 
          prevVolunteers.filter(v => v.id_FormVoluntarie !== confirmDelete.id_FormVoluntarie)
        );
        setSelectedVolunteer(null);
        setConfirmDelete(null);
        showToast("Solicitud eliminada correctamente", "success");
      },
    });
  };

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'} rounded-[20px] shadow-2xl relative`}>
      <h2 className={`text-3xl font-bold mb-8 text-center font-poppins ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Solicitudes de Voluntarios</h2>

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
                onClick={() => handleStatusFilterChange(status.status_Name as 'Aceptada' | 'Rechazada' | 'Pendiente' | 'Todas')}
              >
                {status.status_Name}
              </button>
            ))
          )}
          {isStatusesLoading ? (
            <Skeleton width={100} height={40} className="rounded-full" />
          ) : (
            <button className="px-4 py-2 rounded-full bg-gray-500 text-white" onClick={() => handleStatusFilterChange('Todas')}>
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
                onChange={(e) => handleTypeFilterChange(e)}
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

      <ReusableTableRequests<VolunteerRequest>
        data={currentVolunteers}
        headers={["Nombre", "Tipo", "Fecha inicio", "Fecha fin", "Estatus", "Acciones"]}
        isLoading={(isLoading && !isFiltering) || (isLoadingAllData && isFiltering)}
        skeletonRows={5}
        isDarkMode={isDarkMode}
        pageNumber={pageNumber}
        totalPages={totalFilteredPages}
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

      <ReusableModalRequests
        isOpen={!!selectedVolunteer}
        title="Detalles del voluntario"
        onClose={() => !isAccepting && !isRejecting && setSelectedVolunteer(null)}
        actions={
          <>
            <button
              className="px-7 py-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
              onClick={() => handleAccept(selectedVolunteer!)}
              disabled={isAccepting || isRejecting}
            >
              {isAccepting ? "Procesando..." : "Aceptar"}
            </button>
            {selectedVolunteer?.status_Name !== "Rechazado" && (
              <button
                className="px-7 py-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
                onClick={() => handleReject(selectedVolunteer!)}
                disabled={isRejecting || isAccepting}
              >
                {isRejecting ? "Procesando..." : "Rechazar"}
              </button>
            )}
            {selectedVolunteer?.status_Name === "Rechazado" && (
              <button
                className="px-7 py-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
                onClick={() => setConfirmDelete(selectedVolunteer)}
                disabled={isLoading || isAccepting || isRejecting}
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
              <strong>Fecha de inicio:</strong> {new Date(selectedVolunteer.delivery_Date).toLocaleDateString()}
            </p>
            <p>
              <strong>Fecha de fin:</strong> {new Date(selectedVolunteer.end_Date).toLocaleDateString()}
            </p>
            <p>
              <strong>Estatus:</strong>{" "}
              <span
                className={`px-3 py-1 ml-2 rounded-lg text-white ${
                  selectedVolunteer.status_Name === "Aprobado"
                    ? "bg-green-500"
                    : selectedVolunteer.status_Name === "Rechazado"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              >
                {selectedVolunteer.status_Name}
              </span>
            </p>
            <p>
              <strong>Tipo de voluntario:</strong> {selectedVolunteer.name_voluntarieType}
            </p>
          </>
        )}
        <ConfirmationModal
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
          title="Confirmar eliminación"
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
