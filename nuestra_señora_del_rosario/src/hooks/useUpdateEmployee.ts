// src/hooks/useEmployee.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useToast } from './useToast';
import employeeService from '../services/EmployeeService';
import { EmployeeType } from '../types/EmployeeType';
import { EmployeeUpdateDto } from '../types/EmployeeUpdateType';

export const useEmployeeById = (id: number) => {
  return useQuery<EmployeeType, Error>(
    ['employee', id],
    async () => {
      const response = await employeeService.getEmployeeById(id);
      return response.data;
    },
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    EmployeeType,           // tipo de dato que devuelve
    Error,                  // tipo de error
    { id: number; data: EmployeeUpdateDto } // variables
  >(
    async ({ id, data }) => {
      const response = await employeeService.updateEmployee(id, data);
      return response.data;
    },
    {
      onSuccess: (updated) => {
        showToast('Empleado actualizado correctamente', 'success');
        // invalidar y refetchear el empleado y la lista de empleados si la tuvieras
        queryClient.invalidateQueries(['employee', updated.id_Employee]);
        queryClient.invalidateQueries('employees');
      },
      onError: (err: any) => {
        showToast(
          err.response?.data?.message || err.message || 'Error al actualizar empleado',
          'error'
        );
      },
    }
  );
};
