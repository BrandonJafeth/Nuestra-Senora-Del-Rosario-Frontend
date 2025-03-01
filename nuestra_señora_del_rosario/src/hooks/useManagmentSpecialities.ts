import {  useMutation, useQueryClient } from "react-query";
import { Specialty } from "../types/SpecialityType";
import { useState } from "react";
import specialtyService from "../services/SpecialityService";

export const useManagmentSpecialities = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "warning" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

 

  // 📌 Crear una especialidad médica
  const createSpecialty = useMutation(
    async (data: Specialty) => {
      return await specialtyService.createSpecialty(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("specialties");
        showToast("✅ Especialidad agregada correctamente!", "success");
      },
      onError: () => {
        showToast("❌ Error al agregar la especialidad", "error");
      },
    }
  );

  // 📌 Eliminar una especialidad médica
  const deleteSpecialty = useMutation(
    async (id: number) => {
      return specialtyService.deleteSpecialty(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("specialties");
        showToast("✅ Especialidad eliminada correctamente!", "success");
      },
      onError: (error) => {
        console.error("Error al eliminar:", error);
        showToast("❌ No se puede eliminar la especialidad porque está en uso", "error");
      },
    }
  );

  return { createSpecialty, deleteSpecialty, toast };
};
