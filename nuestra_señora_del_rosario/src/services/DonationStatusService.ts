// FILE: services/DonationStatusService.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { DonationRequest } from '../types/DonationType'; // Asegúrate de que la ruta sea correcta

class DonationStatusService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({ baseURL: 'https://localhost:7066/api' });
  }

  // Método para actualizar el estado de una solicitud de donación
  public updateStatus(id_FormDonation: DonationRequest['id_FormDonation'], statusId: number): Promise<AxiosResponse<void>> {
    return this.api.patch<void>(`/FormDonation/${id_FormDonation}/status`, statusId, {
      headers: { 'Content-Type': 'application/json-patch+json' },
    });
  }
}

const donationStatusService = new DonationStatusService();
export default donationStatusService;
