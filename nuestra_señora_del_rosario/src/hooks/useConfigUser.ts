import { useMutation, useQueryClient } from "react-query";
import userConfigService from "../services/UserConfigService";
import { UpdateUserStatus } from "../types/UserConfigType";
import { AxiosError, AxiosResponse } from "axios";

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<void>, AxiosError, { userId: number; status: UpdateUserStatus }>(
    async ({ userId, status }: { userId: number; status: UpdateUserStatus }) => {
      return await userConfigService.updateUserStatus(userId, status);
    },
    {
      onSuccess: () => {
        // Invalida la query que trae la lista de usuarios para que se refresque
        queryClient.invalidateQueries(['PaginatedUsers']);
      }
    }
  );
};
