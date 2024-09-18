
import { useQuery } from 'react-query'; 
import volunteeringService from '../services/VolunteeringService'; 


export const useVolunteerRequests = () => {
  return useQuery('volunteerRequests', async () => {
    const response = await volunteeringService.getAllVolunteerRequests();
    return response.data; // Extrae los datos de la respuesta de Axios
  });
};
