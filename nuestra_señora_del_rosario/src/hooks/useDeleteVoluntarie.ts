
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import volunteeringService from "../services/VolunteeringService";

// Definir el tipo de error que puede devolver la API
interface ApiError {
  message?: string;
}

// Hook para eliminar una solicitud de donación
export const useDeleteVoluntarieRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await volunteeringService.deleteVolunteerRequest(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voluntaries"] }); // ✅ Forma correcta
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("❌ Error al eliminar la solicitud:", error.response?.data?.message || error.message);
    },
  });
};
