
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import applicationService from "../services/ApplicationService";

// Definir el tipo de error que puede devolver la API
interface ApiError {
  message?: string;
}

// Hook para eliminar una solicitud de donación
export const useDeleteApplicationRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await applicationService.deleteApplicationRequest(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicationRequests"] }); // ✅ Forma correcta
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("❌ Error al eliminar la solicitud:", error.response?.data?.message || error.message);
    },
  });
};
