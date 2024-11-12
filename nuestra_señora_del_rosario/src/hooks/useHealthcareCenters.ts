import { useQuery } from 'react-query';
import healthcareCenterService from '../services/HealthcareCenterService';

export const useHealthcareCenters = () => {
  return useQuery('healthcareCenters', () => healthcareCenterService.getAllHealthcareCenters());
};
