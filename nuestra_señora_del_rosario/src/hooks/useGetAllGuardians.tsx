import { useQuery } from 'react-query';
import guardianService from '../services/GuardianService';
import { Guardian } from '../types/GuardianType';

/**
 * Custom hook para obtener todos los guardianes.
 * Devuelve { data, isLoading, isError, error } para usar en el componente.
 */
export const useGetAllGuardians = () =>
  useQuery<Guardian[], Error>(
    ['guardians'],
    async () => {
      const response = await guardianService.getAllGuardians();
      return response.data;
    }
  );