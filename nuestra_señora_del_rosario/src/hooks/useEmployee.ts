// hooks/useResidents.ts
import { useQuery } from 'react-query';
import { EmployeeType } from '../types/EmployeeType';
import employeeService from '../services/EmployeeService';

interface EmployeeData {
  employees: EmployeeType[];
  totalPages: number;
}

export const useEmployee = (pageNumber: number, pageSize: number) => {
  return useQuery<EmployeeData, Error>(
    ['employees', pageNumber, pageSize],
    async () => {
      const response = await employeeService.getAllEmployeePages(pageNumber, pageSize);
      return response.data;
    },
    {
      keepPreviousData: true, // Mantiene datos previos mientras se cargan los nuevos
    }
  );
};