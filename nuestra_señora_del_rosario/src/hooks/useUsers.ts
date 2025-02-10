import { useQuery } from 'react-query';
import { UserResponsePages } from '../types/UserType';
import userManagmentService from '../services/UserManagmentService';

export const useUsers = (pageNumber: number, pageSize: number) => {
  return useQuery<UserResponsePages, Error>(
    ['users', pageNumber, pageSize],
    async () => {
      // Llama al servicio para obtener los datos paginados
      const response = await userManagmentService.getAllUsersPages(pageNumber, pageSize);
      return {
        count: response.data.count,
        users: response.data.users
      }; // Asegura que la respuesta coincide con el tipo UserResponsePages
    },
    {
      keepPreviousData: true, // Mantiene los datos de la página anterior mientras carga
    }
  );
};
