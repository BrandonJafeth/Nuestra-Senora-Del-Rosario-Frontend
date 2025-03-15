import { useQuery } from 'react-query';
import { InventoryReport } from '../types/InventoryType';
import inventoryService from '../services/InventoryService';


/**
 * Hook para obtener el reporte de inventario filtrado por categoría.
 * @param month - Mes (1-12)
 * @param year - Año
 * @param categoryId - ID de la categoría
 * @param targetUnit - Unidad de conversión
 */
export const useInventoryReportByCategory = (
  month: number,
  year: number,
  categoryId: number,
  targetUnit: string
) => {
  return useQuery<InventoryReport[]>(
    ['inventoryReportByCategory', month, year, categoryId, targetUnit],
    async () => {
      const response = await inventoryService.getReportByCategory(month, year, categoryId, [targetUnit], []);
      return response.data;
    },
    {
      // Puedes añadir opciones de React Query aquí
      // staleTime: 60000,
      // refetchOnWindowFocus: false,
    }
  );
};
