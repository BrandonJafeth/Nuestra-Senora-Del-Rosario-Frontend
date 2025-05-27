// src/hooks/useCreateUser.ts
import { useMutation, useQueryClient } from 'react-query';
import { User } from '../types/UserType';
import userManagmentService from '../services/UserManagmentService';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, User>(
    async (newUser) => {
      try {
        const response = await userManagmentService.createUser(newUser);
        return response;
      } catch (error) {
        console.error('Service error:', error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        // Refetch users data after successful creation
        queryClient.invalidateQueries('PaginatedUsers');
      },
      onError: (error: Error) => {
        console.error('Mutation error:', error);
        // Don't need to do anything here, the component handles the error
      },
    }
  );
};
