import Cookies from "js-cookie";
import { AssignRoleRequest } from "../types/UserType";
import ApiService from "./GenericService/ApiService";

class AssignRoleService extends ApiService<AssignRoleRequest> {
  constructor() {
    super();
  }

  public assignRoleToUser(data: AssignRoleRequest) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.postWithHeaders("/users/assign-role", data, {
      Authorization: `Bearer ${token}`,
    });
  }
}

export default new AssignRoleService();