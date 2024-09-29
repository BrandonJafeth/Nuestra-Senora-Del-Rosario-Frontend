
import { useQuery } from 'react-query'; 
import employeeService from '../services/EmployeeService';


export const useEmployee = () => {
  return useQuery('Employees', async () => {
    const response = await employeeService.getAllEmployees();
    return response.data; 
  });
};
