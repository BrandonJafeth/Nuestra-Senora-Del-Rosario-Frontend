// services/HealthcareCenterService.ts
import { HealthcareCenter } from "../types/HealthcareCenter";
import ApiService from "./GenericService/ApiService";
import Cookies from 'js-cookie';

class HealthcareCenterService extends ApiService<HealthcareCenter> {
  // Obtener todos los centros de atención con token
  public getAllHealthcareCenters() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.getWithHeaders<HealthcareCenter[]>('/HealthcareCenter', {
      Authorization: `Bearer ${token}`,
    });
  }

  // Crear un centro de atención con token
  public createHealthcareCenter(data: HealthcareCenter) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.postWithHeaders('/HealthcareCenter', data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Eliminar un centro de atención con token
  public deleteHealthcareCenter(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.deleteWithHeaders('/HealthcareCenter', id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const healthcareCenterService = new HealthcareCenterService();
export default healthcareCenterService;
