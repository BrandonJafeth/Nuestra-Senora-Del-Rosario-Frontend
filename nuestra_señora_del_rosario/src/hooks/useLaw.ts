import { useQuery } from "react-query";
import { LawType } from "../types/LawType";
import LawService from "../services/LawService";

export const useLaw = () => {
  return useQuery<LawType[], Error>(
    "Law",
    async () => {
      const response = await LawService.getAllLaws();

      if (!response.data?.data || !Array.isArray(response.data.data)) {
        console.error("🚨 Error: Datos de leyes no válidos", response);
        return [];
      }

      return response.data.data.map((item) => ({
        idLaw: item.idLaw,
        lawName: item.lawName || "Desconocido",
        lawDescription: item.lawDescription || "Sin descripción",
      }));
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );
};
