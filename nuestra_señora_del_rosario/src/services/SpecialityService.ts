// services/SpecialtyService.ts
import { Specialty } from "../types/SpecialityType";
import ApiService from "./GenericService/ApiService";
import Cookies from 'js-cookie';

class SpecialtyService extends ApiService<Specialty> {
  // Obtener todas las especialidades con token
  public getAllSpecialties() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.getWithHeaders<Specialty[]>('/Specialty', {
      Authorization: `Bearer ${token}`,
    });
  }

  // Crear una especialidad con token
  public createSpecialty(data: Specialty) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.postWithHeaders('/Specialty', data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Eliminar una especialidad con token
  public deleteSpecialty(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.deleteWithHeaders('/Specialty', id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const specialtyService = new SpecialtyService();
export default specialtyService;
