import { useQuery } from 'react-query';
import applicationService from '../services/ApplicationService'; // Ruta correcta de tu servicio

interface UseApprovedRequestsProps {
  page: number;
  pageSize: number;
}

// Hook para obtener solicitudes aprobadas con paginación y crear residentes desde ellas
export const useApprovedRequests = ({ page, pageSize }: UseApprovedRequestsProps) => {

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

 

  return {
    approvedRequests: approvedRequests.forms, // Lista de solicitudes aprobadas
    totalPages: approvedRequests.totalPages, // Total de páginas para la paginación
    isLoading,
    error
  };
};
