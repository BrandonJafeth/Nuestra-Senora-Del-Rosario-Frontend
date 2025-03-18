import { useQuery } from "react-query";
import unitOfMeasureService from "../services/UnitOfMeasureService";
import { UnitOfMeasure } from "../types/UnitOfMeasureType";
import { ApiResponse } from "../types/AssetsCategoryType";

export const useUnitOfMeasure = () => {
  return useQuery<UnitOfMeasure[], Error>(
    "UnitOfMeasure",
    async () => {
      const response = await unitOfMeasureService.getAllUnits() as unknown as { data: ApiResponse<UnitOfMeasure[]> };

      if (!response.data?.data || !Array.isArray(response.data.data)) {
        console.error("🚨 Error: Datos de unidad de medida no válidos", response);
        return [];
      }

      return response.data.data.map((item) => ({
        unitOfMeasureID: item.unitOfMeasureID ?? 0, // Asegurar que el ID existe
        nombreUnidad: item.nombreUnidad || "Desconocido",
      }));
    },
    {
      staleTime: 5 * 60 * 1000, // Mantiene los datos frescos durante 5 minutos
      cacheTime: 10 * 60 * 1000, // Guarda los datos en caché por 10 minutos
    }
  );
};
