
import { useQuery } from 'react-query'; 
import donationService from '../services/DonationService';


export const useDonationRequests = () => {
  return useQuery('donationRequests', async () => {
    const response = await donationService.getAllDonationRequests();
    return response.data; 
  });
};
