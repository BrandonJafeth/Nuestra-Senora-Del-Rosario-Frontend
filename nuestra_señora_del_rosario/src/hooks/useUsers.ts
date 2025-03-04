import { useQuery } from 'react-query';
import userPaginatedService from '../services/UserPaginatedService';
import { UserResponsePages } from '../types/UserType';


export const usePaginatedUsers = (pageNumber: number, pageSize: number) => {
  return useQuery<UserResponsePages, Error>(
    ['PaginatedUsers', pageNumber, pageSize], 
    async () => {
      const response = await userPaginatedService.getPaginatedUsers(pageNumber, pageSize);
      if (!response.data.users || !response.data.totalPages) {
        throw new Error("La respuesta del backend no tiene la estructura esperada");
      }

      return {
        users: response.data.users,
        totalPages: response.data.totalPages,
      };
      
    },
    {
      keepPreviousData: true, 
      staleTime: 5 * 60 * 1000, 
    }
  );
};
