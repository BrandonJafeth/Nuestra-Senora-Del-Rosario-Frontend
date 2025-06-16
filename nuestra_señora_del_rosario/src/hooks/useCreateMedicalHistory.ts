// src/hooks/useMedicalHistory.ts
import { useMutation, useQueryClient } from 'react-query';
import { MedicalHistory } from '../types/MedicalHistoryType';
import { MedicalHistoryInput } from '../types/MedicalHistoryInputType';
import medicalHistorysService from '../services/MedicalHistoryService';

export const useMedicalHistory = (residentId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: MedicalHistoryInput) => 
      medicalHistorysService.createMedicalHistories(data as unknown as MedicalHistory),
    {
      onSuccess: (newMedicalHistory) => {
        // 1. Invalidamos la consulta para forzar una recarga
        queryClient.invalidateQueries(['medicalHistory', residentId]);
        
        // 2. Actualizamos directamente la caché con los nuevos datos
        queryClient.setQueryData(['medicalHistory', residentId], (oldData: any) => {
          // Si no hay datos previos, devolvemos el nuevo registro como array
          if (!oldData) return [newMedicalHistory];
          
          // Si hay datos previos, añadimos el nuevo registro
          return [...oldData, newMedicalHistory];
        });

        // 3. Forzamos una recarga inmediata
        queryClient.refetchQueries(['medicalHistory', residentId], { 
          active: true 
        });
      },
      // 4. Configuramos para que no se detenga en caso de error
      onError: (error) => {
        console.error("Error al crear el historial médico:", error);
      }
    }
  );
};