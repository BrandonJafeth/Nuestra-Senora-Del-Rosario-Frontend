import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import fileUploadService from "../services/FileUploadService";

// Definir el tipo de error que puede devolver la API
interface ApiError {
  message?: string;
}

// Hook para eliminar un archivo y refrescar la lista
export const useDeleteFile = (residentCedula: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string) => {
      await fileUploadService.deleteFile(fileId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residentDocuments", residentCedula] }); // 🔥 Invalidar solo los documentos de este residente
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("❌ Error al eliminar el archivo:", error.response?.data?.message || error.message);
    },
  });
};
