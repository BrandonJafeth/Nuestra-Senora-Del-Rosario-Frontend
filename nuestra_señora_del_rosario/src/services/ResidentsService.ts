// services/ResidentsService.ts
import axios, { AxiosResponse } from 'axios'; // Importamos axios para usar en la solicitud directa
import ApiService from './GenericService/ApiService';
import { Resident, ResidentPatchDto, ResidentPostFromApplicantForm } from '../types/ResidentsType';

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

  public getResidentInfoById(id: number){
    return this.getOne('/Residents/minimalinfo', id)
  }

  // Actualizar residente (patch de campos específicos) - Este método usa axios directamente
  public updateResidentStatus(id: number, data: ResidentPatchDto): Promise<AxiosResponse<void>> {
    return axios.patch<void>(`https://nuestra-senora-del-rosario-backend.onrender.com/api/Residents/${id}`, data, {
      headers: {
        'Content-Type': 'application/json-patch+json', // Especificamos el tipo de contenido
      },
    });
  }

  public createResidentFromApplicant(data: ResidentPostFromApplicantForm): Promise<AxiosResponse<Resident>> {
    return axios.post<Resident>('hhttps://nuestra-senora-del-rosario-backend.onrender.com/api/Residents/fromApplicant', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Eliminar un residente
  public deleteResident(id: number) {
    return this.delete('/Residents', id);
  }

}

const residentsService = new ResidentsService();
export default residentsService;
