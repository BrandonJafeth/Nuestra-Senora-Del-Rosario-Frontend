import { useMutation, useQueryClient } from 'react-query';
import assignRoleService from '../services/AssignRoleService';
import { AssignRoleRequest, AssignRoleResponse } from '../types/UserType';

export const useAssignRole = () => {
  const queryClient = useQueryClient();
  return useMutation<AssignRoleResponse, Error, AssignRoleRequest>(
    async (roleData: AssignRoleRequest): Promise<AssignRoleResponse> => {
      try {
        const response = await assignRoleService.assignRoleToUser(roleData);
        return {
          success: true,
          message: (response.data as AssignRoleResponse).message
        };
      } catch (error) {
        console.error('Assign role service error:', error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        // Invalida la query de usuarios para que se recargue
        queryClient.invalidateQueries(['PaginatedUsers']);
      },
      onError: (error: Error) => {
        console.error('useAssignRole mutation error:', error);
      }
    }
  );
};
