
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import fileUploadService from "../services/FileUploadService";

// Definir el tipo de error que puede devolver la API
interface ApiError {
  message?: string;
}

// Hook para eliminar una solicitud de donación
export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string) => {
      await fileUploadService.deleteFile(fileId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] }); // ✅ Forma correcta
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("❌ Error al eliminar el archivo:", error.response?.data?.message || error.message);
    },
  });
};
