// FILE: hooks/useCategories.ts
import { useQuery } from 'react-query';
import CategoryService from '../services/CategoryService';
import { Category } from '../types/CategoryType';

export const useCategories = () => {
  return useQuery<Category[], Error>('categories', () => CategoryService.getAllCategories().then((res) => res.data), {
    staleTime: 5 * 60 * 1000, 
    cacheTime: 10 * 60 * 1000,
  });
};
