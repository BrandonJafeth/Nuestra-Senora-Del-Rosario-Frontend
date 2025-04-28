import { useQuery } from 'react-query';
import productService from '../services/ProductService';
import { Product } from '../types/ProductType';

interface ProductData {
  products: Product[];
  totalPages: number;
}

export const useFilterProductsByName = (name: string, pageNumber: number, pageSize: number) => {
  return useQuery<ProductData, Error>(
    ['filteredProducts', name, pageNumber, pageSize], 
    async () => {
      const response = await productService.filterProductsByName(name, pageNumber, pageSize);
      return response.data;
    }, 
    {
      keepPreviousData: true,
      // Solo ejecutar la consulta si hay un término de búsqueda
      enabled: !!name
    }
  );
};