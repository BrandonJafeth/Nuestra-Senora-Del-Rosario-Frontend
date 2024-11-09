// services/InventoryService.ts
import { InventoryReport } from '../types/InventoryType';
import ApiService from './GenericService/ApiService';

class InventoryDailyMovementService extends ApiService<InventoryReport> {
  constructor() {
    super();
  }

  getDailyMovements(date: string) {
    return this.getAll(`/Inventory/movements/daily?date=${date}`);
  }
  
}

const inventoryDailyMovementService = new InventoryDailyMovementService();
export default inventoryDailyMovementService;
