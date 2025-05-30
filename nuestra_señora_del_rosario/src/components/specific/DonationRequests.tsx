import { useState, useEffect, useMemo } from 'react';
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
import { useDeleteDonationRequest } from '../../hooks/useDeleteDonation';
import ConfirmationModal from '../microcomponents/ConfirmationModal';

function DonationRequests() {
  const { isDarkMode } = useThemeDark();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);	
  const [filterStatus, setFilterStatus] = useState<'Aprobado' | 'Rechazado' | 'Pendiente' | 'Todas'>('Todas');
  const [filterType, setFilterType] = useState<string>('Todas');
  const [allDonations, setAllDonations] = useState<DonationRequest[]>([]);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isLoadingAllData, setIsLoadingAllData] = useState(false);
  
  const isFiltering = useMemo(() => {
    return filterStatus !== 'Todas' || filterType !== 'Todas';
  }, [filterStatus, filterType]);
  
  // Para paginación normal sin filtros
  const { data, isLoading } = useDonationRequests(pageNumber, pageSize);
  
  // Para cargar todos los datos cuando se aplica un filtro
  const { data: allData, isLoading: isLoadingAll } = useDonationRequests(1, 1000);
  
  const { data: donationTypes, isLoading: isDonationTypesLoading } = useDonationTypes();
  const { data: statuses, isLoading: isStatusesLoading } = useStatuses();
  const { mutate: updateDonationStatus } = useUpdateDonationStatus();

  const [selectedDonation, setSelectedDonation] = useState<DonationRequest | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<DonationRequest | null>(null);
  const { showToast, message, type } = useToast();
  const { mutate: deleteDonation, isLoading: isDeleting } = useDeleteDonationRequest();

  // Cargar datos paginados normales
  useEffect(() => {
    if (data?.donations) {
      // Solo actualizar si no estamos filtrando
      if (!isFiltering) {
        setAllDonations(prevDonations => {
          const newDonations = [...prevDonations];
          data.donations.forEach(donation => {
            const index = newDonations.findIndex(d => d.id_FormDonation === donation.id_FormDonation);
            if (index >= 0) {
              newDonations[index] = donation;
            } else {
              newDonations.push(donation);
            }
          });
          return newDonations;
        });
      }
    }
  }, [data, isFiltering]);

  // Cargar todos los datos cuando se aplica un filtro
  useEffect(() => {
    if (isFiltering) {
      setIsLoadingAllData(true);
      
      // Si los datos ya están disponibles
      if (allData?.donations) {
        setAllDonations(allData.donations);
        setIsLoadingAllData(false);
      }
    } else {
      setIsLoadingAllData(false);
    }
  }, [allData, isFiltering]);

  // Timeout para evitar loading infinito 
  useEffect(() => {
    if (isLoadingAllData) {
      const timer = setTimeout(() => {
        setIsLoadingAllData(false);
      }, 100); 
      return () => clearTimeout(timer);
    }
  }, [isLoadingAllData]);

  // Activar carga completa cuando cambia un filtro
  useEffect(() => {
    if (isFiltering) {
      setIsLoadingAllData(true);
    }
  }, [filterStatus, filterType]);

  const filteredRequests = useMemo(() => {
    if (!isFiltering) return [];
    
    return allDonations.filter(request => {
      return (
        (filterStatus === 'Todas' || request.status_Name === filterStatus) &&
        (filterType === 'Todas' || request.donationType === filterType)
      );
    });
  }, [allDonations, filterStatus, filterType, isFiltering]);

  const currentPageDonations = useMemo(() => {
    if (!isFiltering) {
      return data?.donations || [];
    } else {
      return filteredRequests.slice(
        (pageNumber - 1) * pageSize,
        pageNumber * pageSize
      );
    }
  }, [isFiltering, data?.donations, filteredRequests, pageNumber, pageSize]);

  const totalPages = useMemo(() => {
    if (!isFiltering) return data?.totalPages || 1;
    return Math.max(1, Math.ceil(filteredRequests.length / pageSize));
  }, [isFiltering, data?.totalPages, filteredRequests.length, pageSize]);

  useEffect(() => {
    if (pageNumber > totalPages) {
      setPageNumber(Math.max(1, totalPages));
    }
  }, [totalPages, pageNumber]);

  const handleAccept = (donation: DonationRequest) => {
    if (!donation || isAccepting || isRejecting) return;
    
    if(donation.status_Name === 'Aprobado'){
      showToast('Esta donación ya ha sido aceptada', 'warning');
      return;
    }
    
    setIsAccepting(true);
    updateDonationStatus(
      { id_FormDonation: donation.id_FormDonation, id_Status: 2 },
      {
        onSuccess: () => {
          setAllDonations(prevDonations => {
            return prevDonations.map(d => {
              if (d.id_FormDonation === donation.id_FormDonation) {
                return { ...d, status_Name: 'Aprobado' };
              }
              return d;
            });
          });
          setSelectedDonation(null);
          setIsAccepting(false);
          showToast('Donación aceptada exitosamente', 'success');
        },
        onError: () => {
          showToast('Error al aceptar la donación', 'error');
          setIsAccepting(false);
        }
      }
    );
  };

  const handleReject = (donation: DonationRequest) => {
    if (!donation || isRejecting || isAccepting) return;
    
    setIsRejecting(true);
    updateDonationStatus(
      { id_FormDonation: donation.id_FormDonation, id_Status: 3 },
      {
        onSuccess: () => {
          setAllDonations(prevDonations => {
            return prevDonations.map(d => {
              if (d.id_FormDonation === donation.id_FormDonation) {
                return { ...d, status_Name: 'Rechazado' };
              }
              return d;
            });
          });
          setSelectedDonation(null);
          setIsRejecting(false);
          showToast('Donación rechazada exitosamente', 'error');
        },
        onError: () => {
          showToast('Error al rechazar la donación', 'error');
          setIsRejecting(false);
        }
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

    deleteDonation(confirmDelete.id_FormDonation, {
      onSuccess: () => {
        setAllDonations(prevDonations => 
          prevDonations.filter(d => d.id_FormDonation !== confirmDelete.id_FormDonation)
        );
        setSelectedDonation(null);
        setConfirmDelete(null);
        showToast("Donación eliminada correctamente", "success");
      },
    });
  };

  const handleStatusFilterChange = (status: 'Aprobado' | 'Rechazado' | 'Pendiente' | 'Todas') => {
    setFilterStatus(status);
    setPageNumber(1);
    
    if (status === 'Todas') {
      // Si volvemos a "Todas", dejamos de mostrar el loader
      setIsLoadingAllData(false);
    }
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
    setPageNumber(1);
    
    if (e.target.value === 'Todas') {
      // Si volvemos a "Todas", dejamos de mostrar el loader
      setIsLoadingAllData(false);
    }
  };

  useEffect(() => {
    setPageNumber(1);
  }, [filterStatus, filterType, pageSize]);

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 ${isDarkMode ? 'bg-[#0D313F]' : 'bg-white'} rounded-[20px] shadow-xl`}>
      <h2 className={`text-3xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Solicitudes de donaciones
      </h2>

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
                  onClick={() => handleStatusFilterChange(status.status_Name as 'Aprobado' | 'Rechazado' | 'Pendiente' | 'Todas')}
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

        <div className='flex gap-4'>
          <div>
            {isDonationTypesLoading ? (
              <Skeleton width={200} height={40} className="rounded-full" />
            ) : (
              <select
                className="px-4 py-2 border rounded-full bg-gray-200"
                onChange={handleTypeFilterChange}
              >
                <option value="Todas">Tipos de donación</option>
                {donationTypes?.map((type) => (
                  <option key={type.id_DonationType} value={type.name_DonationType}>
                    {type.name_DonationType}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex justify-center">
            <label htmlFor="pageSize" className={`mr-2 my-1 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Mostrar:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className={`p-1  border rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
      </div>

      <ReusableTableRequests<DonationRequest>
        data={currentPageDonations}
        headers={['Nombre', 'Tipo de donación', 'Método', 'Fecha', 'Estatus', 'Acciones']}
        isLoading={(isLoading && !isFiltering) || (isLoadingAllData && isFiltering) || isLoadingAll}
        skeletonRows={5}
        isDarkMode={isDarkMode}
        pageNumber={pageNumber}
        totalPages={totalPages}
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
                className="px-4 py-2 bg-orange-400 text-white rounded-xl hover:bg-orange-500 transition"
                onClick={() => setSelectedDonation(donation)}
              >
                Editar
              </button>
            </td>
          </tr>
        )}
      />

      <ReusableModalRequests
        isOpen={!!selectedDonation}
        title="Detalles de la Donación"
        onClose={() => !isAccepting && !isRejecting && setSelectedDonation(null)}
        actions={
          <>
            <button
              className="px-7 py-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
              onClick={() => handleAccept(selectedDonation!)}
              disabled={isAccepting || isRejecting}
              >
              {isAccepting ? "Procesando..." : "Aceptar"}
            </button>
            {selectedDonation?.status_Name !== "Rechazado" && (
              <button
                className="px-7 py-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
                onClick={() => handleReject(selectedDonation!)}
                disabled={isRejecting || isAccepting}
              >
                {isRejecting ? "Procesando..." : "Rechazar"}
              </button>
            )}
            {selectedDonation?.status_Name === "Rechazado" && (
              <button
                className="px-7 py-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
                onClick={() => setConfirmDelete(selectedDonation)}
                disabled={isDeleting || isAccepting || isRejecting}
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            )}
          </>
        }
      >
        {selectedDonation && (
          <>
            <p>
              <strong>Cédula:</strong> {selectedDonation.dn_Cedula}
            </p>
            <p>
              <strong>Teléfono:</strong> {selectedDonation.dn_Phone}
            </p>
            <p>
              <strong>Fecha de donación:</strong>{" "}
              {new Date(selectedDonation.delivery_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Email:</strong> {selectedDonation.dn_Email}
            </p>
            <p>
              <strong>Tipo de donación:</strong> {selectedDonation.donationType}
            </p>
            <p>
              <strong>Estatus:</strong>{" "}
              <span
                className={`px-3 py-1 ml-2 rounded-lg text-white ${
                  selectedDonation.status_Name === "Aprobado"
                    ? "bg-green-500"
                    : selectedDonation.status_Name === "Rechazado"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              >
                {selectedDonation.status_Name}
              </span>
            </p>
            <p>
              <strong>Método:</strong> {selectedDonation.methodDonation}
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

export default DonationRequests;