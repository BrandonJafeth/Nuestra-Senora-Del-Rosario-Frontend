


// services/ResidentPathologyService.ts


import { ResidentPathology } from '../types/ResidentPathology';
import ApiService from './GenericService/ApiService'; 

class ResidentPathologyService extends ApiService<ResidentPathology> {
  constructor() {
    super(); // Usa la URL base desde el genérico
  }

  // Obtener todas las habitaciones
  public getAllResidentPathologies() {
    return this.getAll('/ResidentPathology'); // Cambia la ruta según tu API
  }

  // Obtener una habitación por ID
  public getResidentPathologyById(id: number) {
    return this.getOne('/ResidentPathology', id); // Cambia la ruta según tu API
  }

  // Crear una nueva habitación
  public createResidentPathology(data: ResidentPathology) {
    return this.create('/ResidentPathology', data); // Cambia la ruta según tu API
  }

  // Actualizar una habitación existente
  public updateResidentPathology(id: number, data: Partial<ResidentPathology>) {
    return this.patch(`/ResidentPathology/${id}`, id, data); // Cambia la ruta según tu API
  }

  // Eliminar una habitación
  public deleteResidentPathology(id: number) {
    return this.delete('/ResidentPathology', id); // Cambia la ruta según tu API
  }
}

const residentPathologyService = new ResidentPathologyService();
export default residentPathologyService;
