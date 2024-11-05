// services/InventoryService.ts
import { InventoryReport } from '../types/InventoryType';
import ApiService from './GenericService/ApiService';

class InventoryService extends ApiService<InventoryReport> {
  constructor() {
    super();
  }

  public getMonthlyReport(month: number, year: number) {
    return this.getAll(`/Inventory/report/month?month=${month}&year=${year}`);
  }
  
}

const inventoryService = new InventoryService();
export default inventoryService;
