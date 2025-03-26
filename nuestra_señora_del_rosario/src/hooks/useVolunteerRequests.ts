// hooks/useResidents.ts
import { useQuery } from 'react-query';
import volunteeringService from '../services/VolunteeringService';
import { VolunteerRequest } from '../types/VolunteerType';

interface VolunteerData {
  formVoluntaries: VolunteerRequest[];
  totalPages: number;
}

export const useVolunteerRequests = (pageNumber: number, pageSize: number) => {
  return useQuery<VolunteerData, Error>(
    ['volunteerRequests', pageNumber, pageSize],
    async () => {
      const response = await volunteeringService.getAllVolunteerPages(pageNumber, pageSize);
      console.log(response.data);
      return response.data;
      
    },
    {
      keepPreviousData: true, // Mantiene datos previos mientras se cargan los nuevos
    }
  );
};