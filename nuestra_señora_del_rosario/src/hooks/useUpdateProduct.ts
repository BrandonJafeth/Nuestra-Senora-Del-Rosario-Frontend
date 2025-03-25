// hooks/useUpdateProduct.ts
import { useMutation, useQueryClient } from 'react-query';
import productService from '../services/ProductService';
import { Product } from '../types/ProductType';

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: { id: number; productPatch: Partial<Product> }) =>
      productService.updateProduct(data.id, data.productPatch),
    {
      onSuccess: () => {
        // Invalida todas las queries relacionadas con productos
        queryClient.invalidateQueries({ queryKey: ['productsByCategory'] });
      },
    }
  );
};
