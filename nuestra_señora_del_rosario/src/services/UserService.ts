import { UserData } from '../types/UserType';
import ApiService from './GenericService/ApiService';

class UserService extends ApiService<UserData> {

  // Método para crear un nuevo usuario
  public createUser(data: UserData) {
    return this.create('/users/login', data);
  }

  public assignRoleToEmployee(dniEmployee: number, idRole: number) {
    return this.create(`/users/create-from-employee/${dniEmployee}/${idRole}`, { dniEmployee, password: '' });
  }
}

const userService = new UserService();
export default userService;
