import { useMutation, useQueryClient } from "react-query";
import roomService from "../services/RoomService";
import { RoomType } from "../types/RoomType";
import { useState } from "react";

export const useManagmentRoom = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);

  // 📌 Función para mostrar un toast
  const showToast = (message: string, type: "success" | "error" | "warning" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 📌 Agregar una habitación
  const createRoom = useMutation(
    async (data: RoomType) => {
      const response = await roomService.createRoom(data);
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("rooms");
        showToast("✅ Habitación agregada correctamente!", "success");
      },
      onError: () => {
        showToast("❌ Error al agregar la habitación", "error");
      },
    }
  );

  // 📌 Editar una habitación
  const updateRoom = useMutation(
    async ({ id, data }: { id: number; data: Partial<RoomType> }) => {
      const response = await roomService.updateRoom(id, data);
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("rooms");
        showToast("✅ Habitación actualizada correctamente!", "success");
      },
      onError: () => {
        showToast("❌ Error al actualizar la habitación", "error");
      },
    }
  );

  // 📌 Eliminar una habitación
  const deleteRoom = useMutation(
    async (id: number) => {
      return roomService.deleteRoom(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("rooms");
        showToast("✅ Habitación eliminada correctamente!", "success");
      },
      onError: (error) => {
        console.error("Error al eliminar:", error);
        showToast("❌ No se puede eliminar la habitación porque está en uso", "error");
      },
    }
  );

  return { createRoom, updateRoom, deleteRoom, toast };
};
