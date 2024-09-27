// FILE: hooks/useDonationStatusUpdate.ts
import { useMutation, useQueryClient } from 'react-query';
import { DonationRequest } from '../types/DonationType'; // Asegúrate de que la ruta sea correcta
import { StatusData } from '../types/StatusType';
import donationStatusService from '../services/DonationStatusService';

// Hook para actualizar el estado de una solicitud de donación
export const useUpdateDonationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id_FormDonation, id_Status }: { id_FormDonation: DonationRequest['id_FormDonation'], id_Status: StatusData['id_Status'] }) => {
      await donationStatusService.updateStatus(id_FormDonation, id_Status);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('donationRequests');
      },
    }
  );
};
