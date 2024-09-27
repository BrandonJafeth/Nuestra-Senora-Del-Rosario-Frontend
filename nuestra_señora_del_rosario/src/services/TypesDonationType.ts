// FILE: services/DonationService.ts
import ApiService from './GenericService/ApiService';
import { DonationType } from '../hooks/useDonationTypes';

class DonationTypeService extends ApiService<DonationType> {
  constructor() {
    super();
  }

  // Método específico para obtener todos los tipos de donación
  public getAllDonationTypes() {
    return this.getAll('/DonationType');
  }
}

const donationTypeService = new DonationTypeService();
export default donationTypeService;
