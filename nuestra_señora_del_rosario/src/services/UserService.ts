import { UserData } from '../types/UserType';
import ApiService from './GenericService/ApiService';


class UserService extends ApiService<UserData> {
  // Solo defines los métodos sin necesidad de pasar la URL base
  public getAllUsers() {
    return this.getAll('/users');
  }

  public getUserById(id: number) {
    return this.getOne('/users', id);
  }

  public createUser(data: UserData) {
    return this.create('/User/login', data);
  }

}

const userService = new UserService();
export default userService;
