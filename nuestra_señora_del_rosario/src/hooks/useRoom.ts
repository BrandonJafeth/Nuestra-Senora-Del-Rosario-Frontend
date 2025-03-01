import { useQuery } from "react-query";
import { RoomType } from "../types/RoomType";
import ApiService from "../services/GenericService/ApiService";


const apiService = new ApiService<RoomType>();

export const useRoom = () => {
  return useQuery<RoomType[], Error>(
    "Room",
    async () => {
      const response = await apiService.getAll("Room");

      if (!response.data || !Array.isArray(response.data)) {
        console.error("🚨 Error: Datos de habitaciones no válidos", response);
        return [];
      }

      return response.data.map((item) => ({
        id_Room: item.id_Room ?? 0,
        roomNumber: item.roomNumber || "Sin número",
        capacity: item.capacity ?? 0,
      }));
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );
};
