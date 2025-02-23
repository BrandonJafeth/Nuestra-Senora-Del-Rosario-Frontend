


// services/ResidentMedicationService.ts

import { ResidentMedication } from '../types/ResidentMedicationType';
import ApiService from './GenericService/ApiService'; 

class ResidentMedicationService extends ApiService<ResidentMedication> {
  constructor() {
    super(); // Usa la URL base desde el genérico
  }

  // Obtener todas las habitaciones
  public getAllResidentMedications() {
    return this.getAll('/ResidentMedication'); // Cambia la ruta según tu API
  }

  // Obtener una habitación por ID
  public getResidentMedicationById(id: number) {
    return this.getOne('/ResidentMedication', id); // Cambia la ruta según tu API
  }

  // Crear una nueva habitación
  public createResidentMedication(data: ResidentMedication) {
    return this.create('/ResidentMedication', data); // Cambia la ruta según tu API
  }

  // Actualizar una habitación existente
  public updateResidentMedication(id: number, data: Partial<ResidentMedication>) {
    return this.putWithoutId(`/ResidentMedication/${id}`, data); // Cambia la ruta según tu API
  }

  // Eliminar una habitación
  public deleteResidentMedication(id: number) {
    return this.delete('/ResidentMedication', id); // Cambia la ruta según tu API
  }
}

const residentMedicationService = new ResidentMedicationService();
export default residentMedicationService;
