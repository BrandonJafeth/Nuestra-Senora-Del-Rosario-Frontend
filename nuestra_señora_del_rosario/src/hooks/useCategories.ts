import { useQuery } from "react-query";
import categoryService from "../services/CategoryService";
import { Category } from "../types/CategoryType";
import { ApiResponse } from "../types/AssetsCategoryType";

export const useCategories = () => {
  return useQuery<Category[], Error>(
    "Category",
    async () => {
      const response = await categoryService.getAllCategories() as unknown as { data: ApiResponse<Category[]> };

      if (!response.data?.data || !Array.isArray(response.data.data)) {
        console.error("🚨 Error: Datos de categorías no válidos", response);
        return [];
      }

      return response.data.data.map((item) => ({
        categoryID: item.categoryID ?? 0,
        categoryName: item.categoryName || "Sin nombre",
      }));
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );
};
