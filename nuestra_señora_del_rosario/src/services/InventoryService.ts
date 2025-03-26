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

  public getReportByCategory(
    month: number,
    year: number,
    categoryId: number,
    targetUnits: string[],
    productIds: number[]
  ) {
    // Si no hay productIds, mandamos '0'. Si hay, hacemos join.
    const productIdsParam = productIds.length > 0 ? productIds.join(',') : '0';
  
    // Igual para targetUnits
    const targetUnitsParam = targetUnits.length > 0 ? targetUnits.join(',') : '0';
  
    return this.getAll(
      `/Inventory/report/category/month?month=${month}&year=${year}&categoryId=${categoryId}&productIds=${productIdsParam}&targetUnits=${targetUnitsParam}`
    );
  }
  
}

const inventoryService = new InventoryService();
export default inventoryService;
