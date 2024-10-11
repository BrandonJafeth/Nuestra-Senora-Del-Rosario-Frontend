// hooks/useResidents.ts
import { useQuery } from 'react-query';
import residentsService from '../services/ResidentsService';

export const useResidents = () => {
  return useQuery('residents', async () => {
    const response = await residentsService.getAllResidents();
    return response.data; 
  });
};
