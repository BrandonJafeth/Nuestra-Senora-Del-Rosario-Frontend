import ApiService from './GenericService/ApiService';
import { CreateUserFromEmployeeRequest, CreateUserFromEmployeeResponse } from '../types/UserFromEmployeeType';

class UserFromEmployeeService extends ApiService<CreateUserFromEmployeeRequest> {
  constructor() {
    super();
  }

  public createUserFromEmployee(data: CreateUserFromEmployeeRequest) {
    return this.createWithParams<CreateUserFromEmployeeResponse>(
      '/users/create-from-employee',
      data
    );
  }
}

const createUserFromEmployeeService = new UserFromEmployeeService();
export default createUserFromEmployeeService;
