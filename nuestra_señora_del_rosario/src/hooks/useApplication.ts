// hooks/useResidents.ts
import { useQuery } from 'react-query';
import { ApplicationRequest } from '../types/ApplicationType';
import applicationService from '../services/ApplicationService';

interface AplicationData {
  forms: ApplicationRequest[];
  totalPages: number;
}

export const useAplicationRequests = (pageNumber: number, pageSize: number) => {
  return useQuery<AplicationData, Error>(
    ['applicationRequests', pageNumber, pageSize],
    async () => {
      const response = await applicationService.getAllAplicationPages(pageNumber, pageSize);
      return response.data;
    },
    {
      keepPreviousData: true, // Mantiene datos previos mientras se cargan los nuevos
    }
  );
};