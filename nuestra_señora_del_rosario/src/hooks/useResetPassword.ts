import { useMutation } from 'react-query';
import passwordResetService from '../services/ResetPasswordService';

export const useResetPassword = () => {
  return useMutation((email: string) => passwordResetService.requestPasswordReset(email));
};
