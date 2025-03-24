import Cookies from "js-cookie";
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { DonationRequest } from '../types/DonationType';

class DonationStatusService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({ baseURL: 'https://wg04c4oosck8440w4cg8g08o.nuestrasenora.me/api' });
  }

  // Método para actualizar el estado de una solicitud de donación
  public updateStatus(
    id_FormDonation: DonationRequest['id_FormDonation'], 
    statusId: number
  ): Promise<AxiosResponse<void>> {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.api.patch<void>(
      `/FormDonation/${id_FormDonation}/status`,
      statusId,
      {
        headers: {
          'Content-Type': 'application/json-patch+json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
  }
}

const donationStatusService = new DonationStatusService();
export default donationStatusService;