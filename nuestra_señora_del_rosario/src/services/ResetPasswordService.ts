import { ResetPasswordType } from '../types/ResetPasswordType';
import ApiService from './GenericService/ApiService';

class PasswordResetService extends ApiService<ResetPasswordType> {
  public requestPasswordReset(email: string) {
    return this.create('/PasswordReset/request', { email });
  }
}

const passwordResetService = new PasswordResetService();
export default passwordResetService;
