


// hooks/useGuardian.ts
import { useMutation, useQuery, useQueryClient } from 'react-query';
import guardianService from '../services/GuardianService';
import { useToast } from './useToast';
import { Guardian } from '../types/GuardianType';

// Hook para obtener todos los guardianes
export const useGuardians = () => {
  return useQuery('guardians', guardianService.getAllGuardians);
};

// Hook para crear o actualizar un guardián
export const useGuardianMutation = () => {
  const queryClient = useQueryClient(); // Para refrescar los datos cacheados
  const { showToast } = useToast(); // Para manejar los mensajes de Toast

  // Mutación para crear o actualizar un guardián
  return useMutation(
    async (data: Guardian) => {
      if (data.id_Guardian) {
        // Si tiene un ID, actualizamos el guardián
        return guardianService.updateGuardian(data.id_Guardian, data);
      } else {
        // Si no tiene un ID, creamos un nuevo guardián
        return guardianService.createGuardian(data);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('guardians'); // Refrescar los guardianes
        showToast('Guardían guardado exitosamente', 'success');
      },
      onError: (error) => {
        console.error('Error al guardar el guardián:', error);
        showToast('Error al guardar el guardián', 'error');
      }
    }
  );
};
