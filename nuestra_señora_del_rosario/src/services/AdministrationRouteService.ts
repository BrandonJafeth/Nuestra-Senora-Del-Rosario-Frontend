// services/AdministrationRouteService.ts
import Cookies from "js-cookie";
import { AdministrationRouteType } from "../types/AdministrationRouteType";
import ApiService from "./GenericService/ApiService";

class AdministrationRouteService extends ApiService<AdministrationRouteType> {
  constructor() {
    super();
  }

  // Método privado para obtener los headers con el token de autorización
  private getAuthHeaders() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return { Authorization: `Bearer ${token}` };
  }

  // GET /api/AdministrationRoute
  public getAllAdministrationRouteRequests() {
    return this.getWithHeaders<AdministrationRouteType[]>("/AdministrationRoute", this.getAuthHeaders());
  }

  // GET /api/AdministrationRoute/{id}
  public getAdministrationRouteRequestById(id: number) {
    return this.getWithHeaders<AdministrationRouteType>(`/AdministrationRoute/${id}`, this.getAuthHeaders());
  }

  // GET con paginación (adaptado para incluir headers)
  public getAllAplicationPages(page: number, pageSize: number) {
    return this.getAllPagesWithHeaders(
      "/AdministrationRoute", 
      page, 
      pageSize, 
      this.getAuthHeaders()
    );
  }
  
  // POST /api/AdministrationRoute
  public createAdministrationRouteRequest(data: AdministrationRouteType) {
    return this.postWithHeaders<AdministrationRouteType>(
      "/AdministrationRoute",
      data,
      this.getAuthHeaders()
    );
  }

  // PATCH /api/AdministrationRoute/{id}
  public updateAdministrationRouteRequest(id: number, data: Partial<AdministrationRouteType>) {
    return this.updateWithHeaders(
      `/AdministrationRoute/${id}`,
      data,
      this.getAuthHeaders()
    );
  }

  // DELETE /api/AdministrationRoute/{id}
  public deleteAdministrationRouteRequest(id: number) {
    return this.deleteWithHeaders<null>(
      "/AdministrationRoute",
      id.toString(),
      this.getAuthHeaders()
    );
  }
}

const administrationRouteService = new AdministrationRouteService();
export default administrationRouteService;
