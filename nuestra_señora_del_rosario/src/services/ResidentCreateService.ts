// services/ResidentCreateService.ts
import ApiService from './GenericService/ApiService';
import Cookies from 'js-cookie';
import { ResidentPostType } from '../types/ResidentsType';

class ResidentCreateService extends ApiService<ResidentPostType> {
  constructor() {
    super();
  }

  // Crear un nuevo residente con el token en los headers
  public createResident(data: ResidentPostType) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.postWithHeaders('/Residents', data, {
      Authorization: `Bearer ${token}`,
    });
  }
}

const residentCreateService = new ResidentCreateService();
export default residentCreateService;
