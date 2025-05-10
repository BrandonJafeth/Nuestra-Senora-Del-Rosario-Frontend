import Cookies from "js-cookie";
import ApiService from "./GenericService/ApiService";
import { EmployeeType } from "../types/EmployeeType";
import { EmployeeUpdateDto } from "../types/EmployeeUpdateType";

// Tipo para el filtro de empleados
export interface EmployeeFilterDTO {
  First_Name?: string | null;
  Last_Name1?: string | null;
  Last_Name2?: string | null;
  Dni?: number | null;
}

// Tipo para la respuesta paginada
export interface FilterEmployeesResponse {
  employees: EmployeeType[];
  totalPages: number;
}

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
  public updateEmployee(id: number, data: EmployeeUpdateDto) {
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

  // GET /api/Employee/filter
  public filterEmployees(
    filter: EmployeeFilterDTO, 
    pageNumber: number = 1, 
    pageSize: number = 10
  ) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // Construir query params
    const params = new URLSearchParams();
    if (filter.First_Name) params.append("nombre", filter.First_Name);
    if (filter.Last_Name1) params.append("apellido1", filter.Last_Name1);
    if (filter.Last_Name2) params.append("apellido2", filter.Last_Name2);
    
    // Asegurarnos de que el DNI se maneje correctamente
    if (filter.Dni !== undefined && filter.Dni !== null) {
      console.log('Enviando DNI al servidor:', filter.Dni);
      params.append("dni", filter.Dni.toString());
    }
    
    params.append("pageNumber", pageNumber.toString());
    params.append("pageSize", pageSize.toString());

    // Log para depuración de URL
    const url = `/Employee/filter?${params.toString()}`;
    console.log('URL de filtrado:', url);

    return this.getWithHeaders<FilterEmployeesResponse>(url, {
      Authorization: `Bearer ${token}`,
    });
  }
}

const employeeService = new EmployeeService();
export default employeeService;
