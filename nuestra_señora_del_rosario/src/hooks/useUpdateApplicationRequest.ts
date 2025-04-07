
import { useMutation, useQueryClient } from 'react-query';
import applicationService from '../services/ApplicationService';
import { ApplicationRequest } from '../types/ApplicationType';

export const useUpdateApplicationRequest = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: { 
      id: number; 
      applicationData: Omit<ApplicationRequest, 
        'id_ApplicationForm' | 'id_Applicant' | 'id_Guardian' | 
        'applicationDate' | 'status_Name'> 
    }) => applicationService.putApplicationRequest(data.id, data.applicationData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['applicationRequests']); 
      },
    }
  );
};