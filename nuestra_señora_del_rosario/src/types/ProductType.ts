export interface Product {
    productID: number;
    name: string;
    totalQuantity: number;
    categoryName: string;
    unitOfMeasure: string;
    categoryID: number;
    unitOfMeasureID: number;
    initialQuantity: number;
    
  }

// types/ConvertProductResponse.ts
export interface ConvertedData {
  productID: number;
  name: string;
  totalQuantity: number;
  unitOfMeasure: string;
  convertedUnitOfMeasure: string;
  convertedTotalQuantity: number;
}
