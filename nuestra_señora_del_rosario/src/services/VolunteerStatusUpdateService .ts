import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { VolunteerRequest } from '../types/VolunteerType';

class VolunteerStatusService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({ baseURL: 'https://nuestra-senora-del-rosario-backend.onrender.com/api' });
  }

  // Método para actualizar el estado de una solicitud de voluntariado
  public updateStatus(id_FormVoluntarie: VolunteerRequest['id_FormVoluntarie'], statusId: number): Promise<AxiosResponse<void>> {
    return this.api.patch<void>(`/FormVoluntarie/${id_FormVoluntarie}/status`, statusId, {
      headers: { 'Content-Type': 'application/json-patch+json' },
    });
  }
}

const volunteerStatusService = new VolunteerStatusService();
export default volunteerStatusService;
