import { useQuery } from "react-query";
import roomService from "../services/RoomService";
import { RoomType } from "../types/RoomType";

export const useRoom = () => {
  return useQuery<RoomType[], Error>("rooms", async () => {
    const response = await roomService.getAllRooms();
    if (!response.data || !Array.isArray(response.data)) {
      console.error("❌ Error: Datos de habitaciones no válidos", response);
      return [];
    }

    return response.data.map((item) => ({
      id_Room: item.id_Room ?? 0, // Asegurar que el ID existe
      roomNumber: item.roomNumber || "Desconocido",
      capacity: item.capacity || "No especificado",
    }));
  });
};
