// types/AssetType.ts
export interface AssetType {
    idAsset: number;
    assetName: string;
    serialNumber: string;
    plate: string;
    originalCost: number;
    purchaseDate: string;
    location: string;
    assetCondition: string;
    idAssetCategory: number;
    idModel: number;
    categoryName: string;
    modelName: string;
    brandName: string;
    lawName: string;
    idLaw: number;
  }
  
  export interface PagedAssetsResponse {
    data: AssetType[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
  }
  

  export interface CreateAssetType {
    assetName: string;
    serialNumber: string;
    plate: string;
    originalCost: number;
    purchaseDate: string; // Ejemplo: "2025-03-18T03:41:59.796Z"
    location: string;
    assetCondition: string;
    idAssetCategory: number;
    idModel: number;
    idLaw: number;
  }