import { useQuery } from 'react-query';
import { UserResponsePages } from '../types/UserType';
import userManagmentService from '../services/UserManagmentService';

export const useUsers = (pageNumber: number, pageSize: number) => {
  return useQuery<UserResponsePages, Error>(
    ['users', pageNumber, pageSize],
    async () => {
      const response = await userManagmentService.getAllUsersPages(pageNumber, pageSize);
      const data = response.data;
      
      // Si data es un arreglo, lo transformamos:
      if (Array.isArray(data)) {
        return {
          count: data.length,
          users: data,
        };
      }
      // Sino, asumimos que ya tiene la estructura { count, users }
      return data;
    },
    {
      keepPreviousData: true,
    }
  );
};