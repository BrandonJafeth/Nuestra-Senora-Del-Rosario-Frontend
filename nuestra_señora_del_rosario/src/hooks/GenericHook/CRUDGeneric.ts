import { useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import ApiService from "../../services/GenericService/ApiService";

export const useCRUDGeneric = <T>(endpoint: string) => {
  const queryClient = useQueryClient();
  const apiService = new ApiService<T>();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "warning" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 📌 Crear una entidad
  const createEntity = useMutation(
    async (data: T) => {
      return await apiService.create(endpoint, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(endpoint); // 🔄 Refresca la lista después de agregar
        showToast("✅ Registro agregado correctamente!", "success");
      },
      onError: () => {
        showToast("❌ Error al agregar el registro", "error");
      },
    }
  );

  // 📌 Actualizar una entidad (PUT)
  const updateEntity = useMutation(
    async (data: Partial<T> & { id?: string | number }) => {
      if (!data.id) throw new Error("ID requerido para la actualización");
      return await apiService.update(endpoint, data.id, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(endpoint); // 🔄 Refresca la lista después de actualizar
        showToast("✅ Registro actualizado correctamente!", "success");
      },
      onError: () => {
        showToast("❌ Error al actualizar el registro", "error");
      },
    }
  );

  // 📌 Eliminar una entidad
  const deleteEntity = useMutation(
    async (id: string | number) => {
      return apiService.delete(endpoint, id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(endpoint); // 🔄 Refresca la lista después de eliminar
        showToast("✅ Registro eliminado correctamente!", "success");
      },
      onError: (error) => {
        console.error("❌ Error al eliminar:", error);
        showToast("❌ No se puede eliminar el registro porque está en uso", "error");
      },
    }
  );

  return { createEntity, updateEntity, deleteEntity, toast };
};
