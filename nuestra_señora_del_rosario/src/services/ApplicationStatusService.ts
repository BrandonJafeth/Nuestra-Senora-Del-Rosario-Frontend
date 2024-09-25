// FILE: services/ApplicationStatusService.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApplicationRequest } from '../types/ApplicationType';

class ApplicationStatusService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({ baseURL: 'https://localhost:7066/api' });
  }

  // Método para actualizar el estado de una solicitud de ingreso
  public updateStatus(id_ApplicationForm: ApplicationRequest['id_ApplicationForm'], statusId: number): Promise<AxiosResponse<void>> {
    return this.api.patch<void>(`/ApplicationForm/${id_ApplicationForm}/status`, statusId, {
      headers: { 'Content-Type': 'application/json-patch+json' },
    });
  }
}

const applicationStatusService = new ApplicationStatusService();
export default applicationStatusService;
