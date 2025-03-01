import { useMutation, useQueryClient } from "react-query";
import notesService from "../services/NoteService";
import { NoteRequest } from "../types/NoteTypes";
import { useState } from "react";

export const useManagmentNote = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "warning" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 📌 Crear una nota
  const createNote = useMutation(
    async (data: NoteRequest) => {
      return await notesService.createNotes(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("notes");
        showToast("✅ Nota agregada correctamente!", "success");
      },
      onError: () => {
        showToast("❌ Error al agregar la nota", "error");
      },
    }
  );

  // 📌 Eliminar una nota
  const deleteNote = useMutation(
    async (id: number) => {
      return notesService.deleteNotes(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("notes");
        showToast("✅ Nota eliminada correctamente!", "success");
      },
      onError: (error) => {
        console.error("Error al eliminar:", error);
        showToast("❌ No se puede eliminar la nota porque está en uso", "error");
      },
    }
  );

  return { createNote, deleteNote, toast };
};
