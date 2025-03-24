import { useMutation } from 'react-query';
import assignRoleService from '../services/AssignRoleService';
import { AssignRoleRequest, AssignRoleResponse } from '../types/UserType';

export const useAssignRole = () => {
  return useMutation<AssignRoleResponse, Error, AssignRoleRequest>(
    async (roleData: AssignRoleRequest): Promise<AssignRoleResponse> => {
      const response = await assignRoleService.assignRoleToUser(roleData);
      return {
        success: true, // Asumimos éxito si la petición no lanza error
        message: (response.data as AssignRoleResponse).message
      };
    }
  );
};
