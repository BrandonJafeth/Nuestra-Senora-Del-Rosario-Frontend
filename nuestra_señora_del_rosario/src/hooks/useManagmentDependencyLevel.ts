import { useMutation, useQueryClient } from "react-query";
import dependencyLevelService from "../services/DependencyLevelService";
import { DependencyLevel } from "../types/DependencyLevelType";
import { useState } from "react";

export const useManagmentDependencyLevel = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "warning" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 📌 Crear un nivel de dependencia
  const createDependencyLevel = useMutation(
    async (data: DependencyLevel) => {
      return await dependencyLevelService.createDependencyLevel(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("dependencyLevels");
        showToast("✅ Nivel de dependencia agregado correctamente!", "success");
      },
      onError: () => {
        showToast("❌ Error al agregar el nivel de dependencia", "error");
      },
    }
  );

  // 📌 Eliminar un nivel de dependencia
  const deleteDependencyLevel = useMutation(
    async (id: number) => {
      return dependencyLevelService.deleteDependencyLevel(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("dependencyLevels");
        showToast("✅ Nivel de dependencia eliminado correctamente!", "success");
      },
      onError: (error) => {
        console.error("Error al eliminar:", error);
        showToast("❌ No se puede eliminar el nivel de dependencia porque está en uso", "error");
      },
    }
  );

  return { createDependencyLevel, deleteDependencyLevel, toast };
};
