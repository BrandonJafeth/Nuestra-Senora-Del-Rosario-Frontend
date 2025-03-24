import Cookies from "js-cookie";
import ApiService from "./GenericService/ApiService";
import { TypeSalaryData } from "../types/TypeSalaryType";

class TypeSalaryService extends ApiService<TypeSalaryData> {
  // GET /api/TypeOfSalary
  public getAllTypeSalary() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.getWithHeaders<TypeSalaryData[]>("/TypeOfSalary", {
      Authorization: `Bearer ${token}`,
    });
  }

  // POST /api/TypeOfSalary
  public createTypeSalary(data: TypeSalaryData) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.postWithHeaders<TypeSalaryData>("/TypeOfSalary", data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // PUT /api/TypeOfSalary/{id}
  public updateTypeSalary(id: number, data: Partial<TypeSalaryData>) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.updateWithHeaders(`/TypeOfSalary/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // DELETE /api/TypeOfSalary/{id}
  public deleteTypeSalary(id: number) {
    if (!id) {
      return Promise.reject("ID inválido");
    }
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.deleteWithHeaders<null>("/TypeOfSalary", id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const typeSalaryService = new TypeSalaryService();
export default typeSalaryService;
