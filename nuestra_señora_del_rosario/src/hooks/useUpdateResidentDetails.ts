// hooks/useUpdateResidentDetails.ts
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useToast } from './useToast';
import residentsService from '../services/ResidentsService';
import { ResidentPatchDto } from '../types/ResidentsType';

export const useUpdateResidentDetails = (residentId: number) => {
  const [idRoom, setIdRoom] = useState<number | ''>('');
  const [status, setStatus] = useState<string>('Activo');
  const [idDependencyLevel, setIdDependencyLevel] = useState<number | ''>('');

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Mutación para actualizar el residente
  const mutation = useMutation(
    async (dataToSend: Partial<ResidentPatchDto>) => {
      return residentsService.updateResidentStatus(residentId, dataToSend);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('residents');
        showToast('Residente actualizado exitosamente', 'success');
      },
      onError: (err) => {
        showToast('Error al actualizar residente', 'error');
        console.error('Error en la mutación:', err);
      },
    }
  );

  // Función para manejar el envío con datos como argumento
  const handleSubmit = async (updatedResidentData: Partial<ResidentPatchDto>) => {
    if (!updatedResidentData.id_Room && !updatedResidentData.status && !updatedResidentData.id_DependencyLevel) {
      showToast('Por favor completa los campos a actualizar', 'error');
      return;
    }
    await mutation.mutateAsync(updatedResidentData);
  };

  return {
    idRoom,
    status,
    idDependencyLevel,
    setIdRoom,
    setStatus,
    setIdDependencyLevel,
    handleSubmit,
    isLoading: mutation.isLoading,
    error: mutation.error,
  };
};
