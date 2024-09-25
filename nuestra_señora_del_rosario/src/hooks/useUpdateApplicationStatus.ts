// FILE: hooks/useApplicationStatusUpdate.ts
import { useMutation, useQueryClient } from 'react-query';
import { ApplicationRequest } from '../types/ApplicationType';
import { StatusData } from '../types/StatusType';
import applicationStatusService from '../services/ApplicationStatusService';

// Hook para actualizar el estado de una solicitud de ingreso
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id_ApplicationForm, id_Status }: { id_ApplicationForm: ApplicationRequest['id_ApplicationForm'], id_Status: StatusData['id_Status'] }) => {
      console.log('Enviando:', { id_ApplicationForm, id_Status });
      await applicationStatusService.updateStatus(id_ApplicationForm, id_Status);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('applicationRequests');
      },
    }
  );
};
