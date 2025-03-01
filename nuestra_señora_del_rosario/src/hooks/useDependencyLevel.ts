import { useQuery } from "react-query";
import { DependencyLevel } from "../types/DependencyLevelType";
import ApiService from "../services/GenericService/ApiService";

const apiService = new ApiService<DependencyLevel>();

export const useDependencyLevel = () => {
  return useQuery<DependencyLevel[], Error>(
    "DependencyLevel",
    async () => {
      const response = await apiService.getAll("DependencyLevel");

      if (!response.data || !Array.isArray(response.data)) {
        console.error("🚨 Error: Datos de niveles de dependencia no válidos", response);
        return [];
      }

      return response.data.map((item) => ({
        id_DependencyLevel: item.id_DependencyLevel ?? 0,
        levelName: item.levelName || "Sin nombre",
      }));
    },
    {
      staleTime: 5 * 60 * 1000, // Cache por 5 minutos
      cacheTime: 10 * 60 * 1000, // Almacenar en caché por 10 minutos
    }
  );
};
