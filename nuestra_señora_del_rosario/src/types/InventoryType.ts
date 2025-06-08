export interface InventoryReport {
  productID: number;
  productName: string;
  totalInStock: number;
  initialBalance: number;
  totalIngresos: number;
  totalEgresos: number;
  unitOfMeasure: string;
  convertedTotalInStock: number;
  stockActual: number;
}
