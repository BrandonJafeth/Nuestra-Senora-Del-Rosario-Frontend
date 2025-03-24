import Cookies from "js-cookie";
import { Pathology } from "../types/PathologyType";
import ApiService from "./GenericService/ApiService";

class PathologyService extends ApiService<Pathology> {
  constructor() {
    super();
  }

  // GET /api/Pathology con token
  public getAllPathologies = async () => {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<Pathology[]>("/Pathology", {
      Authorization: `Bearer ${token}`,
    });
  };

  // GET /api/Pathology/{id}
  public getPathologiesById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<Pathology>(`/Pathology/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // POST /api/Pathology
  public createPathologies(data: Pathology) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.postWithHeaders<Pathology>("/Pathology", data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // PATCH /api/Pathology/{id}
  public updatePathologies(id: number, data: Partial<Pathology>) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.patchWithHeaders(`/Pathology/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // DELETE /api/Pathology/{id}
  public deletePathologies(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.deleteWithHeaders<null>("/Pathology", id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const pathologysService = new PathologyService();
export default pathologysService;
