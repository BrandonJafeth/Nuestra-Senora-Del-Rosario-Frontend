// services/ResidentMedicationService.ts

import { ResidentMedication } from '../types/ResidentMedicationType';
import ApiService from './GenericService/ApiService'; 
import Cookies from 'js-cookie'; // Importar js-cookie para acceder al token

class ResidentMedicationService extends ApiService<ResidentMedication> {
  constructor() {
    super(); // Usa la URL base desde el genérico
  }

  // Obtener todas las medicaciones de residentes
  public getAllResidentMedications() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    
    return this.getWithHeaders<ResidentMedication[]>('/ResidentMedication', {
      Authorization: `Bearer ${token}`,
    });
  }

  // Obtener una medicación de residente por ID
  public getResidentMedicationById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    
    return this.getWithHeaders<ResidentMedication>(`/ResidentMedication/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Crear una nueva medicación de residente
  public createResidentMedication(data: ResidentMedication) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    
    return this.postWithHeaders<ResidentMedication>('/ResidentMedication', data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Actualizar una medicación de residente existente
  public updateResidentMedication(id: number, data: Partial<ResidentMedication>) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    
    return this.updateWithHeaders(`/ResidentMedication/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Eliminar una medicación de residente
  public deleteResidentMedication(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    
    return this.deleteWithHeaders('/ResidentMedication', id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const residentMedicationService = new ResidentMedicationService();
export default residentMedicationService;
