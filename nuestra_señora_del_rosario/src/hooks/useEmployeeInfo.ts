// src/hooks/useEmployeeInfo.ts
import { useQuery } from 'react-query';
import employeeService from '../services/EmployeeService';
import { EmployeeType } from '../types/EmployeeType';

export const useEmployeeInfo = (dni: number) => {
  return useQuery<EmployeeType, Error>(
    ['employee', dni],
    async () => {
      const res = await employeeService.getEmployeeById(dni);
      return res.data;
    },
    {
      enabled: !!dni,
      staleTime: 5 * 60 * 1000,
    }
  );
};
