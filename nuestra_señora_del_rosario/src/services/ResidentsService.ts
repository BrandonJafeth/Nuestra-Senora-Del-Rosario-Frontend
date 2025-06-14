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

  // Filtrar residentes por nombre, apellidos y cédula
  public filterResidents(
    nombre?: string, 
    apellido1?: string, 
    apellido2?: string, 
    cedula?: string, 
    pageNumber: number = 1, 
    pageSize: number = 10
  ) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    
    // Construir la URL con los parámetros de consulta
    let url = '/Residents/filter?';
    if (nombre) url += `nombre=${encodeURIComponent(nombre)}&`;
    if (apellido1) url += `apellido1=${encodeURIComponent(apellido1)}&`;
    if (apellido2) url += `apellido2=${encodeURIComponent(apellido2)}&`;
    if (cedula) url += `cedula=${encodeURIComponent(cedula)}&`;
    url += `pageNumber=${pageNumber}&pageSize=${pageSize}`;
    
    return this.getWithHeaders<{residents: Resident[], totalPages: number}>(url, {
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
    if (!token) throw new Error("No se encontró un token de autenticación");    return axios.patch<void>(
      `https://bw48008o8ooo848csscss8o0.hogarnuestrasenoradelrosariosantacruz.org/api/Residents/${id}`,
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
    if (!token) throw new Error("No se encontró un token de autenticación");    return axios.post<Resident>(
      'https://bw48008o8ooo848csscss8o0.hogarnuestrasenoradelrosariosantacruz.org/api/Residents/fromApplicant',
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
