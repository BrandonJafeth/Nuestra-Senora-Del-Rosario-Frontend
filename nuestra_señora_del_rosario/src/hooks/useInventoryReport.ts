// hooks/useInventoryReport.ts
import { useQuery } from 'react-query';
import inventoryService from '../services/InventoryService';
import { InventoryReport } from '../types/InventoryType';

export const useInventoryReport = (month: number, year: number) => {
  return useQuery<InventoryReport[], Error>(
    ['inventoryReport', month, year],
    () => inventoryService.getMonthlyReport(month, year).then((res) => res.data),
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );
};
