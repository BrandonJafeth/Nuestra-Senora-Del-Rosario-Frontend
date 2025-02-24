import { useMutation } from 'react-query';
import { MedicalHistory } from '../types/MedicalHistoryType';
import medicalHistorysService from '../services/MedicalHistoryService';

export const useMedicalHistory = () => {
  return useMutation((data: MedicalHistory) => medicalHistorysService.createMedicalHistories(data));
};
