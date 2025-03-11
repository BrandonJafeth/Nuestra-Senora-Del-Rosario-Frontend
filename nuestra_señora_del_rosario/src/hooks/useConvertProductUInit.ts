// hooks/useConvertProductUnit.ts
import { useQuery } from 'react-query';
import productService from '../services/ProductService';

export function useConvertProductUnit(productId: number, targetUnit: string) {
  return useQuery(
    ['convertProductUnit', productId, targetUnit],
    async () => {
      const response = await productService.convertProductUnit(productId, targetUnit);
      // response.data contendrá la información del producto convertido
      return response.data;
    },
    {
      // Opciones de react-query que necesites:
      // enabled: productId > 0 && !!targetUnit, // por ejemplo
      // refetchOnWindowFocus: false,
      // staleTime: 60_000, // etc.
    }
  );
}
