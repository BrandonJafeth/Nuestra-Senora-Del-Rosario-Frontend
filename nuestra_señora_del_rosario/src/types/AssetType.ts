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
  }
  
  export interface PagedAssetsResponse {
    data: AssetType[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
  }
  