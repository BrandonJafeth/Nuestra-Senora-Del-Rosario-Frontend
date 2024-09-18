import { UserData } from '../types/UserType';
import ApiService from './GenericService/ApiService';

class UserService extends ApiService<UserData> {
  // Método para obtener todos los usuarios
  public getAllUsers() {
    return this.getAll('/users');
  }

  // Método para obtener un usuario por ID
  public getUserById(id: number) {
    return this.getOne('/users', id);
  }

  // Método para crear un nuevo usuario
  public createUser(data: UserData) {
    return this.create('/User/login', data);
  }

  public assignRoleToEmployee(dniEmployee: number, idRole: number) {
    return this.create(`/User/create-from-employee/${dniEmployee}/${idRole}`, { dniEmployee, password: '' });
  }
}

const userService = new UserService();
export default userService;
