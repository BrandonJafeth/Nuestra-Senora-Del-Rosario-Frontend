import { useMutation, useQueryClient } from "react-query";
import userManagmentService from "../services/UserManagmentService";
import { User } from "../types/UserType";
import { AxiosError } from "axios";

// Hook para actualizar el perfil del usuario con React Query
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      return await userManagmentService.updateUserProfile(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userUpdateProfile"] }); // ✅ Invalida la cache para refrescar datos
    },
    onError: (error: AxiosError) => {
      console.error("❌ Error al actualizar el perfil:", error.response?.data || error.message);
    },
  });
};
