import { useCallback, useState } from "react";
import employeeService, { EmployeeFilterDTO, } from "../services/EmployeeService";
import { EmployeeType } from "../types/EmployeeType";
import { useToast } from "./useToast";


interface FilterEmployeesResponse {
  employees: EmployeeType[];
  totalPages: number;
}

interface UseFilterEmployeesReturn {
  employees: EmployeeType[];
  totalPages: number;
  loading: boolean;
  error: string | null;
  filterEmployees: (filter: EmployeeFilterDTO, pageNumber?: number, pageSize?: number) => Promise<FilterEmployeesResponse>;
}

export const useFilterEmployees = (): UseFilterEmployeesReturn => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const filterEmployees = useCallback(
    async (filter: EmployeeFilterDTO, pageNumber: number = 1, pageSize: number = 10) => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await employeeService.filterEmployees(filter, pageNumber, pageSize);
        setEmployees(response.data.employees);
        setTotalPages(response.data.totalPages);
        
        return response.data;
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : "Error al filtrar empleados";
        setError(errorMessage);
        showToast(errorMessage, "error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  return {
    employees,
    totalPages,
    loading,
    error,
    filterEmployees,
  };
};