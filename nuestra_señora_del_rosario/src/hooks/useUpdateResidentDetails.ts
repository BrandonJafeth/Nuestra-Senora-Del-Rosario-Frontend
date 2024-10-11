// hooks/useUpdateResidentDetails.ts
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';


import { useToast } from './useToast'; // Para mostrar notificaciones
import residentsService from '../services/ResidentsService';

export const useUpdateResidentDetails = (residentId: number) => {
  const [id_Room, setRoomNumber] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [sexo, setSexo] = useState('');
  const [id_DependencyLevel, setDependencyLevel] = useState('');

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation(
    async () => {
      return residentsService.updateResident(residentId, {
      
        id_Room: parseInt(id_Room), // ID de la habitación
        entryDate,                  // Fecha de entrada
        sexo,                       // Sexo del residente
        id_DependencyLevel: parseInt(id_DependencyLevel), // Grado de dependencia
      });
    },
    
    {
      onSuccess: () => {
        queryClient.invalidateQueries('residents'); // Refrescar lista de residentes
        showToast('Residente actualizado exitosamente', 'success');
      },
      onError: () => {
        showToast('Error al actualizar residente', 'error');
      },
    }
  );

  const handleSubmit = () => {
    mutation.mutate();
  };

  return {
    id_Room,
    entryDate,
    sexo,
    id_DependencyLevel,
    setRoomNumber,
    setEntryDate,
    setSexo,
    setDependencyLevel,
    handleSubmit,
    isLoading: mutation.isLoading,
    error: mutation.error,
  };
};
