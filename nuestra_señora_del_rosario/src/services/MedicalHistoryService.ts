import Cookies from "js-cookie";
import { MedicalHistory } from "../types/MedicalHistoryType";
import ApiService from "./GenericService/ApiService";

class MedicalHistoryService extends ApiService<MedicalHistory> {
  constructor() {
    super();
  }

  // GET /api/MedicalHistory
  public async getAllMedicalHistories() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<MedicalHistory[]>("/MedicalHistory", {
      Authorization: `Bearer ${token}`,
    });
  }

  // GET /api/MedicalHistory/resident/{id}
  public getMedicalHistoriesById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // Ajusta la ruta si tu endpoint exacto difiere
    return this.getWithHeaders<MedicalHistory>(`/MedicalHistory/resident/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // POST /api/MedicalHistory
  public createMedicalHistories(data: MedicalHistory) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.postWithHeaders<MedicalHistory>("/MedicalHistory", data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // PUT /api/MedicalHistory/{id}
  public updateMedicalHistories(id: number, data: Partial<MedicalHistory>) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // Si en tu ApiService tienes putWithHeaders, úsalo
    // De lo contrario, si usas patchWithHeaders, ajusta el backend a PATCH
    return this.updateWithHeaders(`/MedicalHistory/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // DELETE /api/MedicalHistory/{id}
  public deleteMedicalHistories(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.deleteWithHeaders<null>("/MedicalHistory", id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const medicalHistorysService = new MedicalHistoryService();
export default medicalHistorysService;
