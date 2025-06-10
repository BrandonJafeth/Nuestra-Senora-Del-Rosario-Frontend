// src/hooks/useRoom.ts
import { useQuery } from 'react-query';
import { RoomType } from '../types/RoomType';
import roomService from '../services/RoomService';
import { ApiResponse } from '../types/AssetsCategoryType';

export const useRoom = () => {
  return useQuery<RoomType[], Error>(
    '/Room',
    async () => {
      const response = await roomService.getAllRooms() as unknown as { data: ApiResponse<RoomType[]> };
      if (!response.data?.data || !Array.isArray(response.data.data)) {
        console.error('🚨 Error: Datos de habitaciones no válidos', response);
        return [];
      }
      return response.data.data.map((item) => ({
        id_Room: item.id_Room ?? 0,
        roomNumber: item.roomNumber || 'Sin número',
        capacity: item.capacity ?? 0,
        availableSpots: item.availableSpots ?? 0,
      }));
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );
};
