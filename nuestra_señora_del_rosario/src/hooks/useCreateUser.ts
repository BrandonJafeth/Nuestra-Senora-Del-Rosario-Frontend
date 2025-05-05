// src/hooks/useCreateUser.ts
import { useMutation, useQueryClient } from 'react-query';
import { User } from '../types/UserType';
import userManagmentService from '../services/UserManagmentService';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, User>(
    async (newUser) => {
      const response = await userManagmentService.createUser(newUser);
      return response;
    },
    {
      // 1) Optimistic Update
      onMutate: async (newUser) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries('PaginatedUsers');

        // Snapshot previous data for rollback
        const previous = queryClient.getQueriesData<any>('PaginatedUsers');

        // For each cached page, prepend the new user
        previous.forEach(([queryKey, data]: [any, any]) => {
          if (!data) return;
          queryClient.setQueryData(
            queryKey,
            (old: { users: User[]; totalPages: number } | undefined) => ({
              users: [newUser, ...(old?.users || [])],
              totalPages: old?.totalPages || 0,
            })
          );
        });

        return { previous };
      },

      // 2) Rollback on error
      onError: ( context: any) => {
        context.previous.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      },

      // 3) Always refetch after error or success to sync with server
      onSettled: () => {
        queryClient.invalidateQueries('PaginatedUsers');
      },
    }
  );
};
