// FILE: hooks/useCreateHealthcareCenter.ts
import { useMutation, useQueryClient } from 'react-query';
import { HealthcareCenter } from '../types/HealthcareCenter';
import healthcareCenterService from '../services/HealthcareCenterService';

export const useCreateHealthcareCenter = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: HealthcareCenter) => healthcareCenterService.createHealthcareCenter(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('healthcareCenters'); // Refrescar centros
      },
      onError: (error) => {
        console.error('Error al crear el centro de atención:', error);
      },
    }
  );
};
