import { useMutation } from 'react-query';
import { MedicalHistory } from '../types/MedicalHistoryType';
import { MedicalHistoryInput } from '../types/MedicalHistoryInputType';
import medicalHistorysService from '../services/MedicalHistoryService';

export const useMedicalHistory = () => {
  return useMutation((data: MedicalHistoryInput) => 
    medicalHistorysService.createMedicalHistories(data as unknown as MedicalHistory)
  );
};
