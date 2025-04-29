// services/ResidentPathologyService.ts


import { ResidentPathology } from '../types/ResidentPathology';
import ApiService from './GenericService/ApiService'; 
import Cookies from 'js-cookie'; // Importar js-cookie para acceder al token

class ResidentPathologyService extends ApiService<ResidentPathology> {
  constructor() {
    super(); // Usa la URL base desde el genérico
  }

  // Obtener todas las patologías de residentes
  public getAllResidentPathologies() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    
    return this.getWithHeaders<ResidentPathology[]>('/ResidentPathology', {
      Authorization: `Bearer ${token}`,
    });
  }

  // Obtener una patología de residente por ID
  public getResidentPathologyById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    
    return this.getWithHeaders<ResidentPathology>(`/ResidentPathology/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Crear una nueva patología de residente
  public createResidentPathology(data: ResidentPathology) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    
    return this.postWithHeaders<ResidentPathology>('/ResidentPathology', data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Actualizar una patología de residente existente
  public updateResidentPathology(id: number, data: Partial<ResidentPathology>) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    
    return this.updateWithHeaders(`/ResidentPathology/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Eliminar una patología de residente
  public deleteResidentPathology(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    
    return this.deleteWithHeaders('/ResidentPathology', id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const residentPathologyService = new ResidentPathologyService();
export default residentPathologyService;
