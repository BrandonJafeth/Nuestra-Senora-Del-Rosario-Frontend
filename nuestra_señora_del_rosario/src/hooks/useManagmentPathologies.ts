import { useMutation, useQueryClient } from "react-query";
import pathologyService from "../services/PathologyService";
import { Pathology } from "../types/PathologyType";
import { useState } from "react";

export const useManagmentPathologies = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "warning" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };


  // 📌 Crear una patología
  const createPathology = useMutation(
    async (data: Pathology) => {
      return await pathologyService.createPathologies(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("pathologies");
        showToast("✅ Patología agregada correctamente!", "success");
      },
      onError: () => {
        showToast("❌ Error al agregar la patología", "error");
      },
    }
  );

  // 📌 Eliminar una patología
  const deletePathology = useMutation(
    async (id: number) => {
      return pathologyService.deletePathologies(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("pathologies");
        showToast("✅ Patología eliminada correctamente!", "success");
      },
      onError: (error) => {
        console.error("Error al eliminar:", error);
        showToast("❌ No se puede eliminar la patología porque está en uso", "error");
      },
    }
  );

  return { createPathology, deletePathology, toast };
};
