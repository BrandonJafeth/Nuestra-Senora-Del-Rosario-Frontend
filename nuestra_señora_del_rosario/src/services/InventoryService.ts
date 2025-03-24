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
    // Convierte los arrays en strings separados por comas
    const productIdsParam = productIds.join(',');
    const targetUnitsParam = targetUnits.join(',');
  
    return this.getAll(
      `/Inventory/report/category/month?month=${month}&year=${year}&categoryId=${categoryId}&productIds=${productIdsParam}&targetUnits=${targetUnitsParam}`
    );
  }
}

const inventoryService = new InventoryService();
export default inventoryService;
