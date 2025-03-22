// hooks/GenericHook/CRUDGeneric.ts
import { useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import ApiService from "../../services/GenericService/ApiService";
import Cookies from "js-cookie";

export const useCRUDGeneric = <T>(endpoint: string) => {
  const queryClient = useQueryClient();
  const apiService = new ApiService<T>();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "warning" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Obtiene el token
  const getTokenHeader = () => {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return { Authorization: `Bearer ${token}` };
  };

  // 📌 Crear una entidad (POST)
  const createEntity = useMutation(
    async (data: T) => {
      // Llamamos a createWithHeaders
      return await apiService.postWithHeaders(`${endpoint}`, data, getTokenHeader());
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(endpoint);
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
      // Usamos updateWithHeaders (o patchWithHeaders si tu backend usa PATCH)
      return await apiService.updateWithHeaders(`${endpoint}/${data.id}`, data, getTokenHeader());
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(endpoint);
        showToast("✅ Registro actualizado correctamente!", "success");
      },
      onError: () => {
        showToast("❌ Error al actualizar el registro", "error");
      },
    }
  );

  // 📌 Eliminar una entidad (DELETE)
  const deleteEntity = useMutation(
    async (id: string | number) => {
      return apiService.deleteWithHeaders(endpoint, id.toString(), getTokenHeader());
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(endpoint);
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
