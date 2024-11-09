// hooks/useDailyMovements.ts
import { useQuery } from 'react-query';
import inventoryDailyMovementService from '../services/InventoryDailyMovementService';
import { InventoryReport } from '../types/InventoryType';

export const useDailyMovements = (date: string) => {
  return useQuery<InventoryReport[], Error>(
    ['dailyMovements', date],
    () => inventoryDailyMovementService.getDailyMovements(date).then((res : any) => res.data),
    { enabled: !!date } // Solo ejecuta si hay una fecha
  );
};
