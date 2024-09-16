// src/hooks/useTypeSalary.ts
import { useQuery } from 'react-query';
import typeSalaryService from '../services/TypeSalaryService';

export const useTypeSalary = () => {
  return useQuery('typeSalary', () => typeSalaryService.getAllTypeSalary().then(res => res.data));

};
