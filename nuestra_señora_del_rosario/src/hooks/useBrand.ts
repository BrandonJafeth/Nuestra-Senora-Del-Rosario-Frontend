import { useQuery } from "react-query";
import { BrandType } from "../types/BrandType";
import ApiService from "../services/GenericService/ApiService";


const apiService = new ApiService<BrandType>();

export const useBrand = () => {
  return useQuery<BrandType[], Error>(
    "Brand",
    async () => {
      const response = await apiService.getAll("Brand");

      if (!response.data || !Array.isArray(response.data)) {
        console.error("🚨 Error: Datos de habitaciones no válidos", response);
        return [];
      }

      return response.data.map((item) => ({
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
