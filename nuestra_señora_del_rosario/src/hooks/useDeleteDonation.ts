
import { AxiosError } from "axios";
import donationService from "../services/DonationService";
import { useMutation, useQueryClient } from "react-query";

// Definir el tipo de error que puede devolver la API
interface ApiError {
  message?: string;
}

// Hook para eliminar una solicitud de donación
export const useDeleteDonationRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await donationService.deleteDonationRequest(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donationRequests"] }); // ✅ Forma correcta
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("❌ Error al eliminar la solicitud:", error.response?.data?.message || error.message);
    },
  });
};
