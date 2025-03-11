// hooks/useProductsByCategory.ts
import { useQuery } from 'react-query';
import productService from '../services/ProductService';

export function useProductsByCategory(
  categoryId: number,
  pageNumber: number,
  pageSize: number
) {
  return useQuery(
    ['productsByCategory', categoryId, pageNumber, pageSize],
    () =>
      productService
        .getProductsByCategory(categoryId, pageNumber, pageSize)
        .then((response) => response.data),
    {
      // Opciones adicionales
      // enabled: !!categoryId,
      // refetchOnWindowFocus: false,
      // staleTime: 60000,
    }
  );
}
