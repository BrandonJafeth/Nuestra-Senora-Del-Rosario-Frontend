import { useQuery } from 'react-query';
import productService from '../services/ProductService';
import { Product } from '../types/ProductType';


export const useProducts = () => {
  return useQuery<Product[], Error>('products', () => productService.getAllProducts().then((res) => res.data), {
    staleTime: 5 * 60 * 1000, 
    cacheTime: 10 * 60 * 1000, 
  });
};

