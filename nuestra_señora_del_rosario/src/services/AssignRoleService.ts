import { AssignRoleRequest } from '../types/UserType';
import ApiService from './GenericService/ApiService';

class AssignRoleService extends ApiService<AssignRoleRequest> {
  constructor() {
    super();
  }

  public assignRoleToUser(data: AssignRoleRequest) {
    return this.create('/users/assign-role', data);
  }
}

const assignRoleService = new AssignRoleService();
export default assignRoleService;
