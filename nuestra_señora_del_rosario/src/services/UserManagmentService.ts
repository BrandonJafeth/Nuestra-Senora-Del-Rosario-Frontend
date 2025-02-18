import { AxiosResponse } from 'axios';
import { User } from '../types/UserType';
import ApiService from './GenericService/ApiService';
import Cookies from 'js-cookie';

class UserManagmentService extends ApiService<User> {

  public getAllUsersPages(pageNumber: number, pageSize: number) {
    return this.getAll(`/users?page=${pageNumber}&size=${pageSize}`);
  }

  public getUserById(id: number) {
    return this.getOne('/users', id);
  }

  public async createUser(data: User) {
    const response = await this.create('/users/create', data);
    return response.data;
  }

  public async getUserProfile(token: string) {
    return this.getWithHeaders<User>('/users/me', { Authorization: `Bearer ${token}` });
  }

  public async updateUserProfile(data: Partial<User>) {
    const token = Cookies.get("authToken"); // 🔹 Obtener el token desde cookies
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.updateWithHeaders("/users/update-profile", data, {
      Authorization: `Bearer ${token}`,
    });
  }

  public async changePassword(data: User): Promise<AxiosResponse<void>> {
    const token = Cookies.get("authToken"); // Obtener el token desde cookies
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.postWithHeaders<void>("/users/change-password-authenticated", data, {
      Authorization: `Bearer ${token}`,
    });
  }

}

const userManagmentService = new UserManagmentService();
export default userManagmentService;
