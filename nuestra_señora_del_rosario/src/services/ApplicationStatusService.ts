import Cookies from 'js-cookie';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApplicationRequest } from '../types/ApplicationType';

class ApplicationStatusService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({ baseURL: 'https://bw48008o8ooo848csscss8o0.hogarnuestrasenoradelrosariosantacruz.org/api' });
  }

  // Método para actualizar el estado de una solicitud de ingreso
  public updateStatus(
    id_ApplicationForm: ApplicationRequest['id_ApplicationForm'], 
    statusId: number
  ): Promise<AxiosResponse<void>> {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.api.patch<void>(
      `/ApplicationForm/${id_ApplicationForm}/status`,
      statusId,
      {
        headers: {
          'Content-Type': 'application/json-patch+json',
          'Authorization': `Bearer ${token}`
        },
      }
    );
  }
}

const applicationStatusService = new ApplicationStatusService();
export default applicationStatusService;
