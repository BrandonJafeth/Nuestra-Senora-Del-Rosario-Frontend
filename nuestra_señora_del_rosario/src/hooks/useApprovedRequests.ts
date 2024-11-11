import { useMutation, useQuery, useQueryClient } from 'react-query';
import applicationService from '../services/ApplicationService'; // Ruta correcta de tu servicio
import residentsService from '../services/ResidentsService'; // Ruta correcta de tu servicio de residentes

interface UseApprovedRequestsProps {
  page: number;
  pageSize: number;
}

// Hook para obtener solicitudes aprobadas con paginación y crear residentes desde ellas
export const useApprovedRequests = ({ page, pageSize }: UseApprovedRequestsProps) => {
  const queryClient = useQueryClient();

  // Fetch de solicitudes aprobadas con paginación
  const { data: approvedRequests = { forms: [], totalPages: 0 }, isLoading, error } = useQuery(
    ['approvedRequests', page, pageSize],
    async () => {
      const response = await applicationService.getAllAplicationPages(page, pageSize);
      // Filtrar solo las solicitudes aprobadas
      return {
        forms: response.data.forms.filter((request: any) => request.status_Name === 'Aprobado'),
        totalPages: response.data.totalPages,
      };
    },
    {
      keepPreviousData: true, // Mantiene datos previos mientras se cargan los nuevos
    }
  );

  // Mutación para guardar un nuevo residente basado en una solicitud aprobada
  const { mutate: createResident, isLoading: isCreatingResident, error: createError } = useMutation(
    async (residentData) => {
      return residentsService.createResidentFromApplicant(residentData); // Llamada al endpoint de la API
    },
    {
      onSuccess: () => {
        // Refrescar la lista de residentes o cualquier acción posterior
        queryClient.invalidateQueries('residents');
        console.log('Residente creado correctamente desde solicitud aprobada');
      },
      onError: (error) => {
        console.error('Error al crear residente desde solicitud aprobada:', error);
      },
    }
  );

  return {
    approvedRequests: approvedRequests.forms, // Lista de solicitudes aprobadas
    totalPages: approvedRequests.totalPages, // Total de páginas para la paginación
    isLoading,
    error,
    createResident, // Función para crear un nuevo residente desde una solicitud aprobada
    isCreatingResident,
    createError,
  };
};
