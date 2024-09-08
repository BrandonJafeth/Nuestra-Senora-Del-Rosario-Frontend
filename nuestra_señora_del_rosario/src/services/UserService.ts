import ApiService from './GenericService/ApiService';
import { UserType } from '../types/UserType';

const userService = new ApiService<UserType>();

// Llamadas con endpoints específicos
userService.getAll('/users');  // Usa la URL base: http://localhost:5074/api/users
userService.getOne('/users', 1);  // Usa la URL base: http://localhost:5074/api/users/1

export default userService;
