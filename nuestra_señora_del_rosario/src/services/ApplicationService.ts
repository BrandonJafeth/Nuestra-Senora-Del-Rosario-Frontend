import Cookies from "js-cookie";
import ApiService from "./GenericService/ApiService";
import { ApplicationRequest } from "../types/ApplicationType";

class ApplicationService extends ApiService<ApplicationRequest> {
  constructor() {
    super();
  }

  // GET /api/ApplicationForm
  public getAllApplicationRequests() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<ApplicationRequest[]>("/ApplicationForm", {
      Authorization: `Bearer ${token}`,
    });
  }

  // GET /api/ApplicationForm/{id}
  public getApplicationRequestById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<ApplicationRequest>(`/ApplicationForm/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // GET con paginación usando el método getAllPagesWithHeaders
  public getAllAplicationPages(page: number, pageSize: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getAllPagesWithHeaders("/ApplicationForm", page, pageSize, {
      Authorization: `Bearer ${token}`,
    });
  }

  // POST /api/ApplicationForm
  public createApplicationRequest(data: ApplicationRequest) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.postWithHeaders<ApplicationRequest>("/ApplicationForm", data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // PATCH /api/ApplicationForm/{id}
  public updateApplicationRequest(id: number, data: Partial<ApplicationRequest>) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.patchWithHeaders(`/ApplicationForm/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

   // PUT /api/ApplicationForm/{id}
   public putApplicationRequest(id: number, data: Omit<ApplicationRequest, 
    'id_ApplicationForm' | 'id_Applicant' | 'id_Guardian' | 
    'applicationDate' | 'status_Name'>) {
      const token = Cookies.get("authToken");
      if (!token) throw new Error("No se encontró un token de autenticación");
  
      return this.updateWithHeaders(`/ApplicationForm/${id}`, data, {
        Authorization: `Bearer ${token}`,
      });
    }

  // DELETE /api/ApplicationForm/{id}
  public deleteApplicationRequest(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.deleteWithHeaders<null>("/ApplicationForm", id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const applicationService = new ApplicationService();
export default applicationService;
