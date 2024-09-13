// src/hooks/useTypeSalary.ts
import { useQuery } from 'react-query';
import professionService from '../services/ProfessionService';

export const useProfession = () => {
  return useQuery('profession', () => professionService.getAllProfession().then(res => res.data));
};