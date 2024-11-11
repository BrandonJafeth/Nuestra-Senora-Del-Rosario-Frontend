// hooks/useResidents.ts
import { useQuery } from 'react-query';
import donationService from '../services/DonationService';
import { DonationRequest } from '../types/DonationType';

interface DonationData {
  donations: DonationRequest[];
  totalPages: number;
}

export const useDonationRequests = (pageNumber: number, pageSize: number) => {
  return useQuery<DonationData, Error>(
    ['donations', pageNumber, pageSize],
    async () => {
      const response = await donationService.getAllDonationsPages(pageNumber, pageSize);
      return response.data;
    },
    {
      keepPreviousData: true, // Mantiene datos previos mientras se cargan los nuevos
    }
  );
};