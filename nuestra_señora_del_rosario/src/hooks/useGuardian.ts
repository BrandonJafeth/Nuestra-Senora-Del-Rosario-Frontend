


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
  return useMutation<unknown, Error, Guardian>(
    async (data: Guardian) => {
      try {
        if (data.id_Guardian) {
          // Si tiene un ID, actualizamos el guardián
          return guardianService.updateGuardian(data.id_Guardian, data);
        } else {
          // Si no tiene un ID, creamos un nuevo guardián
          return guardianService.createGuardian(data);
        }
      } catch (error) {
        throw error; // Re-throw para que llegue al onError del componente
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('guardians'); // Refrescar los guardianes
        showToast('Guardían guardado exitosamente', 'success');
      },
      onError: (error: Error) => {
        console.error('Error en onError useGuardianMutation:', error);
        
        let errorMessage = 'Error al guardar el guardián';        // Verificar si es un error de axios
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: unknown; status?: number } };
          console.log('Axios error response:', axiosError.response);
          
          // Intentar extraer mensaje específico del backend
          if (axiosError.response?.data) {
            const responseData = axiosError.response.data as Record<string, unknown>;
            if (typeof responseData === 'object' && responseData.message) {
              errorMessage = String(responseData.message);
            } else if (typeof responseData === 'object' && responseData.error) {
              errorMessage = String(responseData.error);
            } else if (typeof responseData === 'string') {
              errorMessage = responseData;
            } else if (axiosError.response.status === 500) {
              errorMessage = 'Error interno del servidor. Por favor, intente nuevamente.';
            } else if (axiosError.response.status === 400) {
              errorMessage = 'Los datos proporcionados no son válidos.';
            } else if (axiosError.response.status === 409) {
              errorMessage = 'El guardián ya existe en el sistema.';
            }
          }
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        showToast(errorMessage, 'error');
      }
    }
  );
};
