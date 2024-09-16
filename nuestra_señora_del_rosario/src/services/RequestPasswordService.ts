import { RequestPasswordType } from '../types/RequestsPasswordType';
import ApiService from './GenericService/ApiService';

class PasswordResetService extends ApiService<RequestPasswordType> {
  public requestPasswordReset(email: string) {
    return this.create('/PasswordReset/request', { email });
  }
}

const passwordResetService = new PasswordResetService();
export default passwordResetService;
