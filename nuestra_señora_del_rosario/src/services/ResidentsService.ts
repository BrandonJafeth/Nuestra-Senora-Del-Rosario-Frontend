// services/ResidentsService.ts
import axios, { AxiosResponse } from 'axios'; // Importamos axios para usar en la solicitud directa
import ApiService from './GenericService/ApiService';
import { Resident, ResidentPatchDto } from '../types/ResidentsType';

class ResidentsService extends ApiService<Resident> {
  constructor() {
    super();
  }

  // Obtener todos los residentes
  public getAllResidents() {
    return this.getAll('/Residents/all');
  }

  public getAllResidentsPages(page: number, pageSize: number) {
    return this.getAllPages('/Residents', page, pageSize);
  }

  // Obtener un residente por ID
  public getResidentById(id: number) {
    return this.getOne('/Residents', id);
  }

  // Actualizar residente (patch de campos específicos) - Este método usa axios directamente
  public updateResidentStatus(id: number, data: ResidentPatchDto): Promise<AxiosResponse<void>> {
    return axios.patch<void>(`https://nuestra-senora-del-rosario-backend-2.onrender.com/api/Residents/${id}`, data, {
      headers: {
        'Content-Type': 'application/json-patch+json', // Especificamos el tipo de contenido
      },
    });
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
