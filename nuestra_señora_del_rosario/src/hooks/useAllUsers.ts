// hooks/useAllUsers.ts
import { useQuery } from 'react-query';
import userPaginatedService from '../services/UserPaginatedService';
import { User } from '../types/UserType';

// Este hook obtiene todos los usuarios (con un tamaño de página grande)
// para permitir búsquedas globales en toda la lista de usuarios
export const useAllUsers = () => {
  // Usamos un tamaño de página grande para obtener la mayor cantidad de usuarios posible
  // Esto es una solución temporal, lo ideal sería un endpoint específico para obtener todos los usuarios
  const pageSize = 100;
  const pageNumber = 1;

  return useQuery<User[], Error>(
    ['allUsers'],
    async () => {
      try {
        const response = await userPaginatedService.getPaginatedUsers(pageNumber, pageSize);
        if (!response.data || !response.data.users) {
          throw new Error("La respuesta del backend no tiene la estructura esperada");
        }
        return response.data.users;
      } catch (error) {
        console.error('Error al obtener todos los usuarios:', error);
        throw error;
      }
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
    }
  );
};
