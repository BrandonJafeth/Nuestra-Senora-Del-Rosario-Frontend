// hooks/useApplicationRequests.ts
import { useQuery } from 'react-query';
import applicationService from '../services/ApplicationService';

export const useApplicationRequests = () => {
  return useQuery('applicationRequests', async () => {
    const response = await applicationService.getAllApplicationRequests();
    return response.data; // Extrae los datos de la respuesta de Axios
  });
};
