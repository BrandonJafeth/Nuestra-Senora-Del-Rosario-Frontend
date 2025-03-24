// services/ResidentsService.ts
import axios, { AxiosResponse } from 'axios';
import ApiService from './GenericService/ApiService';
import Cookies from 'js-cookie';
import { Resident, ResidentPatchDto, ResidentPostFromApplicantForm } from '../types/ResidentsType';

class ResidentsService extends ApiService<Resident> {
  constructor() {
    super();
  }

  // Obtener todos los residentes
  public getAllResidents() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.getWithHeaders<Resident[]>('/Residents/all', {
      Authorization: `Bearer ${token}`,
    });
  }

  public getAllResidentsPages(page: number, pageSize: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.getAllPagesWithHeaders('/Residents', page, pageSize, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Obtener un residente por ID
  public getResidentById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.getWithHeaders<Resident>(`/Residents/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  public getResidentInfoById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.getWithHeaders<Resident>(`/Residents/minimalinfo/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Actualizar residente (patch de campos específicos)
  public updateResidentStatus(id: number, data: ResidentPatchDto): Promise<AxiosResponse<void>> {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return axios.patch<void>(
      `https://wg04c4oosck8440w4cg8g08o.nuestrasenora.me/api/Residents/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json-patch+json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  public createResidentFromApplicant(data: ResidentPostFromApplicantForm): Promise<AxiosResponse<Resident>> {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return axios.post<Resident>(
      'https://wg04c4oosck8440w4cg8g08o.nuestrasenora.me/api/Residents/fromApplicant',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  // Eliminar un residente
  public deleteResident(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.deleteWithHeaders<null>('/Residents', id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const residentsService = new ResidentsService();
export default residentsService;
