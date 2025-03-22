import { useQuery } from "react-query";
import { BrandType } from "../types/BrandType";
import { ApiResponse } from "../types/AssetsCategoryType";
import brandService from "../services/BrandService";

export const useBrand = () => {
  return useQuery<BrandType[], Error>(
    "/Brand",
    async () => {
      const response = await brandService.getAllBrands(1, 10) as unknown as { data: ApiResponse<BrandType[]> };
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
