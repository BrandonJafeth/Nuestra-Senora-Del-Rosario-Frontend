import ApiService from './GenericService/ApiService';
import { UserType } from '../types/UserType';

class UserService extends ApiService<UserType> {
  // Solo defines los métodos sin necesidad de pasar la URL base
  public getAllUsers() {
    return this.getAll('/users');
  }

  public getUserById(id: number) {
    return this.getOne('/users', id);
  }

  public createUser(data: UserType) {
    return this.create('/users', data);
  }

}

const userService = new UserService();
export default userService;
