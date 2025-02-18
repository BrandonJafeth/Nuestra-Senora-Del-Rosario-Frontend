import { UpdateUserStatus } from '../types/UserConfigType';
import ApiService from './GenericService/ApiService';
import { AxiosResponse } from 'axios';

class UserConfigService extends ApiService<any> {
  // 🔹 Activar o desactivar usuario (Corrección: ahora usa PUT)
  public updateUserStatus(userId: number, data: UpdateUserStatus): Promise<AxiosResponse<void>> {
    return this.putWithoutId(`/users/${userId}/status`, data);
}

}

const userConfigService = new UserConfigService();
export default userConfigService;
