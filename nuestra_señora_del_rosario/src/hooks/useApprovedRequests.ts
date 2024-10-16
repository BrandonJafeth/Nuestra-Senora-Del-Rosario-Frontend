import { useMutation, useQuery, useQueryClient } from 'react-query';
import applicationService from '../services/ApplicationService'; // Ruta correcta de tu servicio
import residentsService from '../services/ResidentsService'; // Ruta correcta de tu servicio de residentes

// Hook para obtener solicitudes aprobadas y crear residentes desde ellas
export const useApprovedRequests = () => {
  const queryClient = useQueryClient();

  // Fetch de solicitudes aprobadas
  const { data: approvedRequests = [], isLoading, error } = useQuery('approvedRequests', async () => {
    const response = await applicationService.getAllApplicationRequests();
    return response.data.filter((request: any) => request.status_Name === 'Aprobado'); // Solo solicitudes aprobadas
  });

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
    approvedRequests,
    isLoading,
    error,
    createResident, // Función para crear un nuevo residente desde una solicitud aprobada
    isCreatingResident,
    createError,
  };
};
