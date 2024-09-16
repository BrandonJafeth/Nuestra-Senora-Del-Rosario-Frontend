import { ResetPasswordData } from '../types/ResetPasswordType';
import ApiService from './GenericService/ApiService'; 

class ResetPasswordService extends ApiService<ResetPasswordData> {
  public updatePassword(data: ResetPasswordData) {
    return this.create('/PasswordReset/update-password', data); 
  }
}

const resetPasswordService = new ResetPasswordService();
export default resetPasswordService;
