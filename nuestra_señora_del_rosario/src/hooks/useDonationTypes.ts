import { useQuery } from 'react-query';
import donationTypeService from '../services/TypesDonationType';

// Tipos de donaciones y métodos de donación
export interface DonationType {
  id_DonationType: number;
  name_DonationType: string;
  methodDonations: Array<{
    id_MethodDonation: number;
    name_MethodDonation: string;
  }>;
}

export const useDonationTypes = () => {
  return useQuery('donationTypes', async () => {
    const response = await donationTypeService.getAllDonationTypes();
    return response.data; // Extrae los datos de la respuesta de Axios
  });
};
