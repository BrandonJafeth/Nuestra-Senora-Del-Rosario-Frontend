import { useState } from "react";
import { User } from "../types/UserType";
import userManagmentService from "../services/UserManagmentService";


export const useChangePassword = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const changePassword = async (data: User) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await userManagmentService.changePassword(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cambiar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  return { changePassword, isLoading, error, success };
};
