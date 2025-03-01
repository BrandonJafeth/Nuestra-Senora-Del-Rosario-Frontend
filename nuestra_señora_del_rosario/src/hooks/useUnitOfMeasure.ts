import { useQuery } from "react-query";
import unitOfMeasureService from "../services/UnitOfMeasureService";
import { UnitOfMeasure } from "../types/UnitOfMeasureType";

export const useUnitOfMeasure = () => {
  return useQuery<UnitOfMeasure[], Error>(
    "unitOfMeasure",
    async () => {
      const response = await unitOfMeasureService.getAllUnits();

      if (!response.data || !Array.isArray(response.data)) {
        console.error("🚨 Error: Datos de unidad de medida no válidos", response);
        return [];
      }

      return response.data.map((item) => ({
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
