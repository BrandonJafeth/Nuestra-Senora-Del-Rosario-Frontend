// hooks/useCreatePaymentReceipt.ts
import { useMutation } from 'react-query';
import paymentReceiptService from '../services/PaymentReceiptService';
import { PaymentReceiptType } from '../types/PaymentReceiptType';

export const useCreatePaymentReceipt = () => {
  return useMutation((data: PaymentReceiptType) => paymentReceiptService.createPaymentReceipt(data));
};
