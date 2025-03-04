import { UpdateUserStatus } from '../types/UserConfigType';
import ApiService from './GenericService/ApiService';
import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

class UserConfigService extends ApiService<any> {
  // 🔹 Activar o desactivar usuario con autenticación
  public async updateUserStatus(userId: number, data: UpdateUserStatus): Promise<AxiosResponse<void>> {
    const token = Cookies.get("authToken"); // 🔹 Obtener el token desde cookies
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.updateWithHeaders(`/users/${userId}/status`, data, {
      Authorization: `Bearer ${token}`,
    });
  }
}

const userConfigService = new UserConfigService();
export default userConfigService;
