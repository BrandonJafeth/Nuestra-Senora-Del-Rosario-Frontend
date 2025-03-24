import { useQuery } from "react-query";
import { ProfessionData } from "../types/ProfessionType";
import professionService from "../services/ProfessionService";
import { ApiResponse } from "../types/AssetsCategoryType";

export const useProfession = () => {
  return useQuery<ProfessionData[], Error>(
    "/Profession",
    async () => {
      // Llama al método que envía el token en la cabecera
      const response = await professionService.getAllProfession() as unknown as { data: ApiResponse<ProfessionData[]> };

      if (!response.data?.data || !Array.isArray(response.data.data)) {
        console.error("🚨 Error: Datos de profesiones no válidos", response);
        return [];
      }

      return response.data.data.map((item) => ({
        id_Profession: item.id_Profession ?? 0,
        name_Profession: item.name_Profession || "Sin nombre",
      }));
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );
};
