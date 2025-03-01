import { useMutation, useQueryClient } from "react-query";
import professionService from "../services/ProfessionService";
import { ProfessionData } from "../types/ProfessionType";
import { useState } from "react";

export const useManagmentProfession = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "warning" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 📌 Agregar una profesión
  const createProfession = useMutation(
    async (data: ProfessionData) => {
      return await professionService.createProfession(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("professions");
        showToast("✅ Profesión agregada correctamente!", "success");
      },
      onError: () => {
        showToast("❌ Error al agregar la profesión", "error");
      },
    }
  );

  // 📌 Editar una profesión
  const updateProfession = useMutation(
    async ({ id, data }: { id: number; data: Partial<ProfessionData> }) => {
      if (data.id_Profession === undefined) {
        throw new Error("id_Profession is required");
      }
      return await professionService.updateProfession(id, data as ProfessionData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("professions");
        showToast("✅ Profesión actualizada correctamente!", "success");
      },
      onError: () => {
        showToast("❌ Error al actualizar la profesión", "error");
      },
    }
  );

  // 📌 Eliminar una profesión
  const deleteProfession = useMutation(
    async (id: number) => {
      return professionService.deleteProfession(id.toString());
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("professions");
        showToast("✅ Profesión eliminada correctamente!", "success");
      },
      onError: (error) => {
        console.error("Error al eliminar:", error);
        showToast("❌ No se puede eliminar la profesión porque está en uso", "error");
      },
    }
  );

  return { createProfession, updateProfession, deleteProfession, toast };
};
