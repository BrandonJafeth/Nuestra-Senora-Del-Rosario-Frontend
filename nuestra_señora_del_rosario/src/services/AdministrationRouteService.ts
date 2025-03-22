// services/AdministrationRouteService.ts
import Cookies from "js-cookie";
import { AdministrationRouteType } from "../types/AdministrationRouteType";
import ApiService from "./GenericService/ApiService";

class AdministrationRouteService extends ApiService<AdministrationRouteType> {
  constructor() {
    super();
  }

  // GET /api/AdministrationRoute
  public getAllAdministrationRouteRequests() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<AdministrationRouteType[]>("/AdministrationRoute", {
      Authorization: `Bearer ${token}`,
    });
  }

  // GET /api/AdministrationRoute/{id}
  public getAdministrationRouteRequestById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<AdministrationRouteType>(`/AdministrationRoute/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // GET con paginación (adaptado para incluir headers)
  public getAllAplicationPages(page: number, pageSize: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // Suponiendo que tu ApiService.getAllPages acepte un tercer parámetro para headers,
    // de lo contrario, se puede implementar directamente con this.api.get()
    return this.getAllPages(
      "/AdministrationRoute",
      page,
      pageSize
    );
  }

  // POST /api/AdministrationRoute
  public createAdministrationRouteRequest(data: AdministrationRouteType) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.postWithHeaders<AdministrationRouteType>(
      "/AdministrationRoute",
      data,
      { Authorization: `Bearer ${token}` }
    );
  }

  // PATCH /api/AdministrationRoute/{id}
  public updateAdministrationRouteRequest(id: number, data: Partial<AdministrationRouteType>) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.updateWithHeaders(
      `/AdministrationRoute/${id}`,
      data,
      { Authorization: `Bearer ${token}` }
    );
  }

  // DELETE /api/AdministrationRoute/{id}
  public deleteAdministrationRouteRequest(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.deleteWithHeaders<null>(
      "/AdministrationRoute",
      id.toString(),
      { Authorization: `Bearer ${token}` }
    );
  }
}

const administrationRouteService = new AdministrationRouteService();
export default administrationRouteService;
