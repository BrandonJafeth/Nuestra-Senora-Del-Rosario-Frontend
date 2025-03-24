import { UserData } from '../types/UserType';
import ApiService from './GenericService/ApiService';
import Cookies from 'js-cookie';

class UserService extends ApiService<UserData> {

  // Método para crear un nuevo usuario (sin token)
  public createUser(data: UserData) {
    return this.create('/users/login', data);
  }

  // Método para asignar rol a empleado, enviando el token en la cabecera
  public assignRoleToEmployee(dniEmployee: number, idRole: number) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.postWithHeaders(
      `/users/create-from-employee/${dniEmployee}/${idRole}`,
      { dniEmployee, password: '' },
      { Authorization: `Bearer ${token}` }
    );
  }
}

const userService = new UserService();
export default userService;
