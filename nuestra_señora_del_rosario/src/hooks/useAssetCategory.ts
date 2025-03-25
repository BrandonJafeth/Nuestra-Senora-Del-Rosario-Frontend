import { useQuery } from "react-query";
import assetCategoryService from "../services/AssetCategoryService";
import { ApiResponse, AssetsCategoryType } from "../types/AssetsCategoryType";

export const useAssetCategory = () => {
  return useQuery<AssetsCategoryType[], Error>(
    "/AssetCategory",
    async () => {
      const response = await assetCategoryService.getAllAssetCategorys() as unknown as { data: ApiResponse<AssetsCategoryType[]> };

      if (!response.data?.data || !Array.isArray(response.data.data)) {
        console.error("🚨 Error: Datos no válidos", response);
        return [];
      }

      return response.data.data.map((item) => ({
        idAssetCategory: item.idAssetCategory,
        categoryName: item.categoryName || "Desconocido",
      }));
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );
};
