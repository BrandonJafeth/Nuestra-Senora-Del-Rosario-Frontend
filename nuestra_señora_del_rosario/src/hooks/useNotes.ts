// hooks/useNotes.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import notesService from '../services/NoteService';
import { NoteRequest } from '../types/NoteTypes';

// Hook para obtener todas las notas
export const useNotes = () => {
  return useQuery('notes', notesService.getAllNotes, {
    select: (response) => response.data, // Extrae los datos del response
    staleTime: 1000 * 60 * 5, // Cachea las notas por 5 minutos
    refetchOnWindowFocus: false, // Evita refetch al cambiar de pestaña
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

// Hook para actualizar una nota existente
export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, data }: { id: number; data: Partial<NoteRequest> }) =>
      notesService.updateNotes(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notes'); // Refresca las notas tras actualizar
      },
    }
  );
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
