import { useQuery } from "react-query";
import { Pathology } from "../types/PathologyType";
import pathologysService from "../services/PathologyService";
import { ApiResponse } from "../types/AssetsCategoryType";

export const usePathologies = () => {
  return useQuery<Pathology[], Error>(
    "/Pathology", // ✅ Debe coincidir con la key en `invalidateQueries`
    async () => {
      const response = await pathologysService.getAllPathologies() as unknown as { data: ApiResponse<Pathology[]> };

      if (!response.data || !Array.isArray(response.data)) {
        console.error("🚨 Error: Datos de patologías no válidos", response);
        return [];
      }

      return response.data.map((item) => ({
        id_Pathology: item.id_Pathology ?? 0,
        name_Pathology: item.name_Pathology || "Desconocido",
      }));
    },
    {
      staleTime: 5 * 60 * 1000, // Cache por 5 minutos
      cacheTime: 10 * 60 * 1000, // Almacenar en caché por 10 minutos
    }
  );
};
