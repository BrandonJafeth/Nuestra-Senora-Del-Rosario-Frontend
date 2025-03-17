import { useQuery } from "react-query";

import ApiService from "../services/GenericService/ApiService";
import { AssetsCategoryType } from "../types/AssetsCategoryType";


const apiService = new ApiService<AssetsCategoryType>();

export const useAssetCategory = () => {
  return useQuery<AssetsCategoryType[], Error>(
    "AssetCategory",
    async () => {
      const response = await apiService.getAll("AssetCategory");

      if (!response.data || !Array.isArray(response.data)) {
        console.error("🚨 Error: Datos de los AssetCategoryos no válidos", response);
        return [];
      }

      return response.data.map((item) => ({
        idAssetCategory: item.idAssetCategory ?? 0,
        categoryName: item.categoryName || "Desconocido",
      }));
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );
};
