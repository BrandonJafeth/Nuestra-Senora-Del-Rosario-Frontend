// hooks/useCreateResidentMedication.ts
import { useMutation, UseMutationOptions } from 'react-query';
import { ResidentMedication } from '../types/ResidentMedicationType';
import residentMedicationService from '../services/ResidentMedicationService';
import { AxiosResponse, AxiosError } from 'axios';

export const useCreateResidentMedication = (
  options?: UseMutationOptions<
    AxiosResponse<ResidentMedication>, 
    AxiosError, 
    ResidentMedication
  >
) => {
  return useMutation(
    (data: ResidentMedication) => residentMedicationService.createResidentMedication(data),
    options
  );
};
