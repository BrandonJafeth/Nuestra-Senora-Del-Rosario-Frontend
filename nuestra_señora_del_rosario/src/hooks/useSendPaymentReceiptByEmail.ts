// hooks/useSendPaymentReceiptByEmail.ts
import { useMutation } from 'react-query';
import paymentReceiptService from '../services/PaymentReceiptService';

export const useSendPaymentReceiptByEmail = (receiptId: number) => {
  return useMutation(() => paymentReceiptService.sendPaymentReceiptByEmail(receiptId));
};
