// services/ResidentsService.ts
import ApiService from './GenericService/ApiService';
import { Resident } from '../types/ResidentsType';

class ResidentsService extends ApiService<Resident> {
  constructor() {
    super();
  }

  // Obtener todos los residentes
  public getAllResidents() {
    return this.getAll('/Residents');
  }

  // Obtener un residente por ID
  public getResidentById(id: number) {
    return this.getOne('/Residents', id);
  }

  // Actualizar residente (patch de campos específicos)
  public updateResidentStatus(id: number, data: { 
    id_Room: number; 
    status: string; 
    id_DependencyLevel: number; 
    fechaNacimiento: string; 
  }) {
    return this.patch(`/Residents/${id}`, id,data);
  }

  // Eliminar un residente
  public deleteResident(id: number) {
    return this.delete('/Residents', id);
  }

  // Crear residente desde solicitud aprobada
  public createResidentFromApplicant(data: any) {
    return this.create('/Residents/fromApplicant', data);
  }
}

const residentsService = new ResidentsService();
export default residentsService;
