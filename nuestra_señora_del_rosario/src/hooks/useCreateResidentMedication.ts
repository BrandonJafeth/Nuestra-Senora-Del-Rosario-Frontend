// hooks/useCreatePaymentReceipt.ts
import { useMutation } from 'react-query';
import { ResidentMedication } from '../types/ResidentMedicationType';
import residentMedicationService from '../services/ResidentMedicationService';

export const useCreateResidentMedication = () => {
  return useMutation((data: ResidentMedication) => residentMedicationService.createResidentMedication(data));
};
