// hooks/useProductById.ts
import { useQuery } from 'react-query';
import productService from '../services/ProductService';
import { Product } from '../types/ProductType';

export const useProductById = (productId: number | null) => {
  return useQuery<Product | undefined>(
    ['product', productId],
    async () => {
      const response = await productService.getProductById(productId!);
      return response.data;
    },
    {
      enabled: !!productId, // Ejecuta la consulta solo si productId no es null
    }
  );
};
