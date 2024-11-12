import { useMutation } from 'react-query';
import productService from '../services/ProductService';
import { Product } from '../types/ProductType';

export const useCreateProduct = () => {
  return useMutation((data: Product) => productService.createProduct(data));
};
