export interface AssetsCategoryType {
  idAssetCategory: number;
    categoryName: string;
}

export interface ApiResponse<T> {
  data: T;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
