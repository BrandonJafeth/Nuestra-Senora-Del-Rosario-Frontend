import { useQuery } from 'react-query';
import { UserResponsePages } from '../types/UserType';
import userManagmentService from '../services/UserManagmentService';

export const useUsers = (pageNumber: number, pageSize: number) => {
  return useQuery<UserResponsePages, Error>(
    ['users', pageNumber, pageSize],
    async () => {
      // Supongamos que el servicio devuelve un array de usuarios directamente
      const response = await userManagmentService.getAllUsersPages(pageNumber, pageSize);
      return {
        count: response.data.length,
        users: response.data.users,
      }; // Ahora se retorna un objeto con count y users
    },
    {
      keepPreviousData: true, // Mantiene los datos de la página anterior mientras carga
    }
  );
};