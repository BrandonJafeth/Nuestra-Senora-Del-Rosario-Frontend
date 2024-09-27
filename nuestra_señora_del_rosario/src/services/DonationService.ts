import ApiService from './GenericService/ApiService'; // Asegúrate de que la ruta sea correcta
import { DonationRequest } from '../types/DonationType';

class DonationService extends ApiService<DonationRequest> {
  getAllDonationService() {
    throw new Error('Method not implemented.');
  }
  constructor() {
    super(); // Usa la URL base desde el genérico
  }

  // Métodos específicos del voluntariado
  public getAllDonationRequests() {
    return this.getAll('/FormDonation');
  }

  public getDonationRequestById(id: number) {
    return this.getOne('/FormDonation', id);
  }

  public createDonationRequest(data: DonationRequest) {
    return this.create('/FormDonation', data);
  }

  public updateDonationRequest(id: number, data: Partial<DonationRequest>) {
    return this.patch(`/FormDonation/${id}/status`, id, data); 
  }

  public deleteDonationRequest(id: number) {
    return this.delete('/FormDonation', id);
  }
}

const donationService = new DonationService();
export default donationService;
