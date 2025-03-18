import { useQuery } from "react-query";
import ApiService from "../services/GenericService/ApiService";
import { Category } from "../types/CategoryType";
import { ApiResponse } from "../types/AssetsCategoryType";

const apiService = new ApiService<Category>();

export const useCategories = () => {
  return useQuery<Category[], Error>(
    "Category",
    async () => {
      const response = await apiService.getAll("Category") as unknown as { data: ApiResponse<Category[]> };

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
      staleTime: 5 * 60 * 1000, // Cache por 5 minutos
      cacheTime: 10 * 60 * 1000, // Almacenar en caché por 10 minutos
    }
  );
};
