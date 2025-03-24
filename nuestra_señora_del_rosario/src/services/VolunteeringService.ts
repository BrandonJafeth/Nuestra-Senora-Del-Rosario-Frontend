import Cookies from "js-cookie";
import ApiService from "./GenericService/ApiService";
import { VolunteerRequest } from "../types/VolunteerType";

class VolunteeringService extends ApiService<VolunteerRequest> {
  constructor() {
    super();
  }

  // GET /api/FormVoluntarie
  public getAllVolunteerRequests() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<VolunteerRequest[]>("/FormVoluntarie", {
      Authorization: `Bearer ${token}`,
    });
  }

  // GET con paginación
  public getAllVolunteerPages(page: number, pageSize: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // Asumimos que getAllPages acepta un objeto de headers
    return this.getAllPagesWithHeaders("/FormVoluntarie", page, pageSize, {
      Authorization: `Bearer ${token}`,
    });
  }

  // GET /api/FormVoluntarie/{id}
  public getVolunteerRequestById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<VolunteerRequest>(`/FormVoluntarie/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // POST /api/FormVoluntarie
  public createVolunteerRequest(data: VolunteerRequest) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.postWithHeaders<VolunteerRequest>("/FormVoluntarie", data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // PATCH /api/FormVoluntarie/{id}/status
  public updateVolunteerRequest(id: number, data: Partial<VolunteerRequest>) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.patchWithHeaders(`/FormVoluntarie/${id}/status`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // DELETE /api/FormVoluntarie/{id}
  public deleteVolunteerRequest(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.deleteWithHeaders<null>("/FormVoluntarie", id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const volunteeringService = new VolunteeringService();
export default volunteeringService;
