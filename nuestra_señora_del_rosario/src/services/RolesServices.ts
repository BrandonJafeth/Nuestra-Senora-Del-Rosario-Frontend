import { RoleType } from "../types/RolesType";
import ApiService from "./GenericService/ApiService";
import Cookies from "js-cookie";

class RoleService extends ApiService<RoleType> {
  public getAllRoles() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.getWithHeaders<RoleType[]>("/Rol", {
      Authorization: `Bearer ${token}`,
    });
  }
}

const roleService = new RoleService();
export default roleService;
