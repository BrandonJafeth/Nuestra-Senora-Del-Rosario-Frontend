import Cookies from "js-cookie";
import { ProfessionData } from "../types/ProfessionType";
import ApiService from "./GenericService/ApiService";

class ProfessionService extends ApiService<ProfessionData> {
  // GET /api/Profession
  public getAllProfession() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<ProfessionData[]>("/Profession", {
      Authorization: `Bearer ${token}`,
    });
  }

  // POST /api/Profession
  public createProfession(data: ProfessionData) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.postWithHeaders<ProfessionData>("/Profession", data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // PUT /api/Profession/{id}
  public updateProfession(id: number, data: ProfessionData) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.updateWithHeaders(`/Profession/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // DELETE /api/Profession/{id}
  public deleteProfession(id: string) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.deleteWithHeaders<null>("/Profession", id, {
      Authorization: `Bearer ${token}`,
    });
  }
}

const professionService = new ProfessionService();
export default professionService;
