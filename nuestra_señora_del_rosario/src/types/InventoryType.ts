export interface InventoryReport {
  productID: number;
  productName: string;
  totalInStock: number;
  totalIngresos: number;
  totalEgresos: number;
  unitOfMeasure: string;
  convertedTotalInStock: number;
}
