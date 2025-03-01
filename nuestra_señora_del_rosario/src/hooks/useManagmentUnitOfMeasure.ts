import { useMutation, useQueryClient } from "react-query";
import unitOfMeasureService from "../services/UnitOfMeasureService";
import { useState } from "react";
import { UnitOfMeasure } from "../types/UnitOfMeasureType";

export const useManagmentUnitOfMeasure = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);

  // 📌 Función para mostrar un toast
  const showToast = (message: string, type: "success" | "error" | "warning" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 📌 Agregar una unidad de medida
  const createUnitOfMeasure = useMutation(
    async (data: UnitOfMeasure) => {
      const response = await unitOfMeasureService.createUnit(data);
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("unitOfMeasure");
        showToast("Unidad de Medida agregada correctamente!", "success");
      },
      onError: () => {
        showToast("Error al agregar Unidad de Medida", "error");
      },
    }
  );

  // 📌 Editar una unidad de medida
  const updateUnitOfMeasure = useMutation(
    async ({ id, data }: { id: number; data: Partial<UnitOfMeasure> }) => {
      if (data.unitOfMeasureID === undefined) {
        throw new Error("unitOfMeasureID is required");
      }
      const response = await unitOfMeasureService.updateUnit(id, data as UnitOfMeasure);
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("unitOfMeasure");
        showToast("✅ Unidad de Medida actualizada correctamente!", "success");
      },
      onError: () => {
        showToast("❌ Error al actualizar Unidad de Medida", "error");
      },
    }
  );

  // 📌 Eliminar una unidad de medida
  const deleteUnitOfMeasure = useMutation(
    async (id: number | undefined) => {
      if (id === undefined || id === null) {
        throw new Error("ID de Unidad de Medida es inválido");
      }
      return unitOfMeasureService.deleteUnit(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("unitOfMeasure");
        showToast("✅ Unidad de Medida eliminada correctamente!", "success");
      },
      onError: () => {
        showToast("❌ No se puede eliminar la Unidad de Medida porque está en uso", "error");
      },
    }
  );

  return { createUnitOfMeasure, updateUnitOfMeasure, deleteUnitOfMeasure, toast };
};
