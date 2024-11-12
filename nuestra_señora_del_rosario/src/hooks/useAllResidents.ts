import { useQuery } from 'react-query';
import residentsService from '../services/ResidentsService';

export const useAllResidents = () => {
  return useQuery('allresidents', () => residentsService.getAllResidents());
};
