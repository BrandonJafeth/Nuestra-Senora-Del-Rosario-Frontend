import { useState } from "react";
import userManagmentService from "../services/UserManagmentService";
import { User } from "../types/UserType";
import { AxiosError } from "axios";

export const useUpdateUserProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [success, setSuccess] = useState(false);

  const updateUserProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await userManagmentService.updateUserProfile(data);
      setSuccess(true);
    } catch (err) {
      setError(err as AxiosError);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUserProfile, isLoading, error, success };
};
