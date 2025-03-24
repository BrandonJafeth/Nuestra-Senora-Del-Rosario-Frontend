import Cookies from "js-cookie";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { VolunteerRequest } from "../types/VolunteerType";

class VolunteerStatusService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({ baseURL: 'https://wg04c4oosck8440w4cg8g08o.nuestrasenora.me/api' });
  }

  // PATCH /api/FormVoluntarie/{id}/status
  public updateStatus(id_FormVoluntarie: VolunteerRequest["id_FormVoluntarie"], statusId: number): Promise<AxiosResponse<void>> {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.api.patch<void>(`/FormVoluntarie/${id_FormVoluntarie}/status`, statusId, {
      headers: {
        "Content-Type": "application/json-patch+json",
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

const volunteerStatusService = new VolunteerStatusService();
export default volunteerStatusService;
