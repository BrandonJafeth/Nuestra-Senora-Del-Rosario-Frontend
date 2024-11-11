import { useQuery } from 'react-query';
import productService from '../services/ProductService';
import { Product } from '../types/ProductType';

interface ProductData {
  products: Product[];
  totalPages: number;
}

export const useProducts = (pageNumber: number, pageSize: number) => {
  return useQuery<ProductData, Error>(['products', pageNumber, pageSize], async () => {
    const response = await productService.getAllProducts(pageNumber, pageSize);
    return response.data; // Aquí retornamos solo 'data'
  }, {
    keepPreviousData: true,
  });
};