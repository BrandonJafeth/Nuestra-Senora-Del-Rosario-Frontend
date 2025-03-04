
import { useMutation } from "react-query";
import userConfigService from "../services/UserConfigService";
import { UpdateUserStatus } from "../types/UserConfigType";
import { AxiosError, AxiosResponse } from "axios";

export const useUpdateUserStatus = () => {
  return useMutation<AxiosResponse<void>, AxiosError, { userId: number; status: UpdateUserStatus }>(
    async ({ userId, status }: { userId: number; status: UpdateUserStatus }) => {
      return await userConfigService.updateUserStatus(userId, status);
    }
  );
};
