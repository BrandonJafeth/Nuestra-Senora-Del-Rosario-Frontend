// hooks/useCreatePaymentReceipt.ts
import { useMutation } from 'react-query';
import residentPathologyService from '../services/ResidentPathologyService';
import { ResidentPathology } from '../types/ResidentPathology';

export const useCreateResidentPathology = () => {
  return useMutation((data: ResidentPathology) => residentPathologyService.createResidentPathology(data));
};
