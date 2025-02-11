import { useState } from 'react';
import userConfigService from '../services/UserConfigService';
import { UpdateUserStatus } from '../types/UserConfigType';
import { AxiosError } from 'axios';

export const useUpdateUserStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateUserStatus = async (userId: number, status: UpdateUserStatus) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    try {
      await userConfigService.updateUserStatus(userId, status);
      setIsSuccess(true);
    } catch (err) {
      setError(err as AxiosError);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUserStatus, isLoading, error, isSuccess };
};
