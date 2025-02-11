import { User } from '../types/UserType';
import ApiService from './GenericService/ApiService';

class UserManagmentService extends ApiService<User> {

       public getAllUsersPages(pageNumber: number, pageSize: number) {
    return this.getAll(`/users?page=${pageNumber}&size=${pageSize}`);
  }
      
        // Método para obtener un usuario por ID
        public getUserById(id: number) {
          return this.getOne('/users', id);
        }

        public async createUser(data: User) {
          const response = await this.create('/users/create', data);
          return response.data; 
        }
        
}

const userManagmentService = new UserManagmentService();
export default userManagmentService;
