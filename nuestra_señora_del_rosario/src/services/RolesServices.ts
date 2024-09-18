import { RoleType } from "../types/RolesType";
import ApiService from "./GenericService/ApiService";

class RoleService extends ApiService<RoleType> {
    public getAllRoles() {
      return this.getAll('/Rol'); 
    }
  }
  
  const roleService = new RoleService();
  export default roleService;