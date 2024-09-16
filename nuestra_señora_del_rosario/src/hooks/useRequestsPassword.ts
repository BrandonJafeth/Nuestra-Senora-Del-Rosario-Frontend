import { useMutation } from 'react-query';
import passwordResetService from '../services/RequestPasswordService';

export const useRequestsPassword = () => {
  return useMutation((email: string) => passwordResetService.requestPasswordReset(email));
};
