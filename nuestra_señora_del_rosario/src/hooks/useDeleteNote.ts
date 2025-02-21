
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import notesService from "../services/NoteService";

// Definir el tipo de error que puede devolver la API
interface ApiError {
  message?: string;
}

// Hook para eliminar una solicitud de donación
export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await notesService.deleteNotes(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] }); // ✅ Forma correcta
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("❌ Error al eliminar la nota:", error.response?.data?.message || error.message);
    },
  });
};
