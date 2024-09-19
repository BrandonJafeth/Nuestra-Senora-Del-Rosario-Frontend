import { useMutation, useQueryClient } from 'react-query';

import { VolunteerRequest } from '../types/VolunteerType';
import { StatusData } from '../types/StatusType';
import volunteerStatusService from '../services/VolunteerStatusUpdateService ';

// Hook para actualizar el estado de una solicitud de voluntariado
export const useUpdateVolunteerStatus = () => {
    const queryClient = useQueryClient();
  
    return useMutation(
      async ({ id_FormVoluntarie, id_Status }: { id_FormVoluntarie: VolunteerRequest['id_FormVoluntarie'], id_Status: StatusData['id_Status'] }) => {
        console.log('Enviando:', { id_FormVoluntarie, id_Status });
        await volunteerStatusService.updateStatus(id_FormVoluntarie, id_Status);
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('volunteerRequests');
        },
      }
    );
  };
  
  