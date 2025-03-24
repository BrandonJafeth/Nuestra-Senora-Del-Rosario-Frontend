import { AxiosResponse } from 'axios';
import { User } from '../types/UserType';
import ApiService from './GenericService/ApiService';
import Cookies from 'js-cookie';

class UserManagmentService extends ApiService<User> {
  // Obtener usuarios paginados con token en los headers
  public getPaginatedUsers(pageNumber: number, pageSize: number) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    
    return this.getAllPagesWithHeaders(`/users/paginated`, pageNumber, pageSize, {
      Authorization: `Bearer ${token}`
    });
  }

  // Obtener un usuario por ID con token en los headers
  public getUserById(id: number) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    
    return this.getWithHeaders<User>(`/users/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Crear un usuario enviando el token en los headers
  public async createUser(data: User) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    
    const response = await this.postWithHeaders<User>('/users/create', data, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  }

  // Obtener el perfil del usuario autenticado (ya utiliza token)
  public async getUserProfile() {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    
    return this.getWithHeaders<User>('/users/me', {
      Authorization: `Bearer ${token}`,
    });
  }

  // Actualizar el perfil del usuario con token en los headers
  public async updateUserProfile(data: Partial<User>) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    
    return this.updateWithHeaders('/users/update-profile', data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Cambiar la contraseña del usuario autenticado con token en los headers
  public async changePassword(data: User): Promise<AxiosResponse<void>> {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    
    return this.postWithHeaders<void>('/users/change-password-authenticated', data, {
      Authorization: `Bearer ${token}`,
    });
  }
}

const userManagmentService = new UserManagmentService();
export default userManagmentService;
