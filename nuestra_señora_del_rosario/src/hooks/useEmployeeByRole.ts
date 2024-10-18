import { useQuery } from 'react-query';
import employeeService from '../services/EmployeeService';

export const useEmployeesByRole = (role: string) => {
  return useQuery(['employeesByRole', role], () => employeeService.getEmployeesByRole(role));
};
