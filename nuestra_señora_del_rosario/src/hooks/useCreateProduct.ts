import { useMutation, useQueryClient } from 'react-query';
import productService from '../services/ProductService';
import { Product } from '../types/ProductType';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: Product) => productService.createProduct(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
      },
    }
  );
};
