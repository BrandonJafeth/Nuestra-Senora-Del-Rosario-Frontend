// services/UserPaginatedService.ts
import { UserResponsePages } from '../types/UserType';
import ApiService from './GenericService/ApiService';
import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

class UserPaginatedService extends ApiService<UserResponsePages> {
  public async getPaginatedUsers(
    pageNumber: number,
    pageSize: number
  ): Promise<AxiosResponse<UserResponsePages>> {
    // Obtenemos el token desde las cookies
    const token = Cookies.get('authToken');
    if (!token) {
      throw new Error('No se encontró un token de autenticación');
    }

    // Llamamos a getAllPagesWithHeaders en lugar de getAllPages
    return this.getAllPagesWithHeaders(
      '/users/paginated',
      pageNumber,
      pageSize,
      {
        Authorization: `Bearer ${token}`,
      }
    );
  }
}

const userPaginatedService = new UserPaginatedService();
export default userPaginatedService;
