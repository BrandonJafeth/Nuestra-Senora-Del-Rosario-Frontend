// hooks/useRooms.ts
import { useQuery } from 'react-query';
import roomService from '../services/RoomService';

export const useRoom = () => {
  return useQuery('rooms', async () => {
    const response = await roomService.getAllRooms(); // Usamos el servicio para obtener las habitaciones
    return response.data; // Asumiendo que response.data contiene la lista de habitaciones
  });
};
