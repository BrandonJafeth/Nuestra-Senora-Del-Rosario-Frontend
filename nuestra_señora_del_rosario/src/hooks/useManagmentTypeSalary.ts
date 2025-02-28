import { useMutation, useQueryClient } from "react-query";
import typeSalaryService from "../services/TypeSalaryService";
import { TypeSalaryData } from "../types/TypeSalaryType";
import { useState } from "react";

export const useManagmentTypeSalary = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);

  // 📌 Función para mostrar un toast
  const showToast = (message: string, type: "success" | "error" | "warning" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 📌 Agregar un tipo de salario
  const createTypeSalary = useMutation(
    async (data: TypeSalaryData) => {
      const response = await typeSalaryService.createTypeSalary(data);
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("typeSalary");
        showToast("✅ Tipo de Salario agregado correctamente!", "success");
      },
      onError: () => {
        showToast("❌ Error al agregar Tipo de Salario", "error");
      },
    }
  );

  // 📌 Editar un tipo de salario
  const updateTypeSalary = useMutation(
    async ({ id, data }: { id: number; data: Partial<TypeSalaryData> }) => {
      const response = await typeSalaryService.updateTypeSalary(id, data);
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("typeSalary");
        showToast("✅ Tipo de Salario actualizado correctamente!", "success");
      },
      onError: () => {
        showToast("❌ Error al actualizar Tipo de Salario", "error");
      },
    }
  );

  // 📌 Eliminar un tipo de salario
  const deleteTypeSalary = useMutation(
    async (id: number) => {
      const response = await typeSalaryService.deleteTypeSalary(id);
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("typeSalary");
        showToast("✅ Tipo de Salario eliminado correctamente!", "success");
      },
      onError: () => {
        showToast("❌ No se puede eliminar el Tipo de Salario porque está en uso", "error");
      },
    }
  );

  return { createTypeSalary, updateTypeSalary, deleteTypeSalary, toast };
};
