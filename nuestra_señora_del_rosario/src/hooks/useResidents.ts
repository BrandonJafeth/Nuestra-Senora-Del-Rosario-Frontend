import { useQuery } from 'react-query';
import { Resident } from '../types/ResidentsType';
import residentsService from '../services/ResidentsService';

interface ResidentData {
  residents: Resident[];
  totalPages: number;
}

export const useResidents = (pageNumber: number, pageSize: number) => {
  return useQuery<ResidentData, Error>(['residents', pageNumber, pageSize], async () => {
    const response = await residentsService.getAllResidentsPages(pageNumber, pageSize);
    return response.data; // Aquí retornamos solo 'data'
  }, {
    keepPreviousData: true,
  });
};