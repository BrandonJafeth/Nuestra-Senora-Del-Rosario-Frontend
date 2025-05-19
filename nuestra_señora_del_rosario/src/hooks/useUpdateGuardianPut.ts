// src/hooks/useUpdateGuardianPut.ts
import { useMutation, useQueryClient } from 'react-query';
import Cookies from 'js-cookie';
import guardianService from '../services/GuardianService';
import { Guardian } from '../types/GuardianType';

// hooks/useUpdateGuardianPut.ts
export const useUpdateGuardianPut = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, data }: { id: number; data: Partial<Guardian> }) => {
      const token = Cookies.get('authToken')!;
      // data debe incluir ahora id_Guardian
      return guardianService.updateGuardianPut(id, data, token);
    },
    { onSuccess: () => queryClient.invalidateQueries('guardians') }
  );
};
