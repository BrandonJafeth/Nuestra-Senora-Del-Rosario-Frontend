import Cookies from "js-cookie";
import ApiService from "./GenericService/ApiService";
import { EmployeeType } from "../types/EmployeeType";

class EmployeeService extends ApiService<EmployeeType> {
  // GET /api/Employee
  public getAllEmployees() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<EmployeeType[]>("/Employee", {
      Authorization: `Bearer ${token}`,
    });
  }

  // GET /api/Employee/{id}
  public getEmployeeById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<EmployeeType>(`/Employee/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // GET con paginación
  public getAllEmployeePages(page: number, pageSize: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getAllPagesWithHeaders("/Employee", page, pageSize, {
      Authorization: `Bearer ${token}`,
    });
  }

  // POST /api/Employee
  public createEmployee(data: EmployeeType) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.postWithHeaders<EmployeeType>("/Employee", data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // PUT /api/Employee/{id}
  public updateEmployee(id: number, data: Partial<EmployeeType>) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // Usa updateWithHeaders si tu ApiService lo tiene, o patchWithHeaders si es un PATCH
    return this.updateWithHeaders(`/Employee/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // GET /api/Employee/by-professions?professionIds=...
  public getEmployeesByProfession(professionIds: number | number[]) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    const queryParam = Array.isArray(professionIds) ? professionIds.join(",") : professionIds;
    return this.getWithHeaders<EmployeeType[]>(
      `/Employee/by-professions?professionIds=${queryParam}`,
      { Authorization: `Bearer ${token}` }
    );
  }

  // DELETE /api/Employee/{id}
  public deleteEmployee(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.deleteWithHeaders<null>("/Employee", id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const employeeService = new EmployeeService();
export default employeeService;
