import { useQuery } from "react-query";
import { BrandType } from "../types/BrandType";
import ApiService from "../services/GenericService/ApiService";
import { ApiResponse } from "../types/AssetsCategoryType";

const apiService = new ApiService<BrandType>();

export const useBrand = () => {
  return useQuery<BrandType[], Error>(
    "Brand",
    async () => {
      const response = await apiService.getAll("Brand") as unknown as { data: ApiResponse<BrandType[]> };
      if (!response.data?.data || !Array.isArray(response.data.data)) {
        console.error("🚨 Error: Datos de marcas no válidos", response);
        return [];
      }

      return response.data.data.map((item) => ({
        idBrand: item.idBrand ?? 0,
        brandName: item.brandName || "Desconocido"
      }));
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );
};
