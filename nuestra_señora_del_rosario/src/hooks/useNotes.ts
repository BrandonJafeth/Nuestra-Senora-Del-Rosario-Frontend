// hooks/useNotes.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import notesService from '../services/NoteService';
import { NoteRequest } from '../types/NoteTypes';

export const useNotes = () => {
  return useQuery<NoteRequest[], Error>("notes", async () => {
    const response = await notesService.getAllNotes();
    if (!response.data || !Array.isArray(response.data)) {
      console.error("❌ Error: Datos de notas no válidos", response);
      return [];
    }

    return response.data.map((item) => ({
      id_Note: item.id_Note ?? 0,
      reason: item.reason || "Sin motivo",
      noteDate: item.noteDate ? new Date(item.noteDate).toLocaleDateString() : "Fecha desconocida", // 📌 Formatea la fecha
      description: item.description || "Sin descripción",
    }));
  });
};

// Hook para crear una nueva nota
export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation((newNote: NoteRequest) => notesService.createNotes(newNote), {
    onSuccess: () => {
      queryClient.invalidateQueries('notes'); // Refresca las notas tras crear una nueva
    },
  });
};



// Hook para eliminar una nota
export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation((id: number) => notesService.deleteNotes(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('notes'); // Refresca las notas tras eliminar
    },
  });
};
