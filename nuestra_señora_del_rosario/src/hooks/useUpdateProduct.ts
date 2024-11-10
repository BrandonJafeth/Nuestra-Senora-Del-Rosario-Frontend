// hooks/useUpdateProduct.ts
import { useMutation, useQueryClient } from 'react-query';
import UpdateProductService from '../services/UpdateProductService';
import { ProductPatchType } from '../types/ProductPatchType';
import { useToast } from './useToast';

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation(
    async ({ id, patchData }: { id: number; patchData: Partial<ProductPatchType> }) => {
      const response = await UpdateProductService.updateProduct(id, patchData);
      if (!response) {
        throw new Error('Error updating product');
      }
      return response;
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('products');
        showToast('Producto actualizado exitosamente', 'success');
        await new Promise((resolve) => setTimeout(resolve, 2000));
      },
      onError: async () => {
        showToast('Error al actualizar el producto', 'error');
        await new Promise((resolve) => setTimeout(resolve, 2000));
      },
    }
  );
};
