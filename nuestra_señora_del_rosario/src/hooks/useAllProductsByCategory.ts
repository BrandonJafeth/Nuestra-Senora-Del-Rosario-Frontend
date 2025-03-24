// FILE: src/hooks/useProductsByCategory.ts
import { useQuery } from 'react-query';
import productService from '../services/ProductService';
import { Product } from '../types/ProductType';

export const useAllProductsByCategory = (categoryId: number) => {
  return useQuery<Product[], Error>(
    ['allProductsByCategory', categoryId],
    async () => {
      // Llamamos al método del servicio que obtendrá los productos por categoría
      const response = await productService.getAllProductsByCategory(categoryId);
      return response.data; // Asegúrate de que 'data' contenga el arreglo de productos
    },
    {
      // Ahora permitimos que se ejecute la query también cuando categoryId=0
      enabled: categoryId >= 0,
      keepPreviousData: true,
    }
  );
};
