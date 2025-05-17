// src/hooks/useVerifyCedula.ts
import { useQuery } from 'react-query';
import CedulaVerificationService from '../services/CedulaVerificationService'
import { CedulaVerificationResponse } from '../types/CedulaType'

export function useVerifyCedula(cedula: string) {
  return useQuery<CedulaVerificationResponse, Error>({
    queryKey: ['verifyCedula', cedula],
    queryFn: async () => {
      const response = await CedulaVerificationService.verifyCedula(cedula);
      return response.data;
    },
    enabled: cedula.trim().length > 0, // sólo corre cuando hay algo que verificar
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}
