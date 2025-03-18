import { useQuery } from "react-query";
import { ModelType } from "../types/ModelType";
import ApiService from "../services/GenericService/ApiService";
import { ApiResponse } from "../types/AssetsCategoryType";

const apiService = new ApiService<ModelType>();

export const useModel = () => {
  return useQuery<ModelType[], Error>(
    "Model",
    async () => {
      const response = await apiService.getAll("Model") as unknown as { data: ApiResponse<ModelType[]> };

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
