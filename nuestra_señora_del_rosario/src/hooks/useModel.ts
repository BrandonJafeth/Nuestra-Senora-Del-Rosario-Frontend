import { useQuery } from "react-query";
import { ModelType } from "../types/ModelType";
import modelService from "../services/ModelService";
import { ApiResponse } from "../types/AssetsCategoryType";

export const useModel = () => {
  return useQuery<ModelType[], Error>(
    "/Model",
    async () => {
      const response = await modelService.getAllModels() as unknown as { data: ApiResponse<ModelType[]> };

      if (!response.data?.data || !Array.isArray(response.data.data)) {
        console.error("🚨 Error: Datos de los modelos no válidos", response);
        return [];
      }

      return response.data.data.map((item) => ({
        idModel: item.idModel ?? 0,
        modelName: item.modelName || "Desconocido",
        idBrand: item.idBrand ?? 0,
        brandName: item.brandName || "Desconocido",
      }));
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );
};
