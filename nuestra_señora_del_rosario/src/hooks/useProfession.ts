import { useQuery } from "react-query";
import { ProfessionData } from "../types/ProfessionType";
import ApiService from "../services/GenericService/ApiService";

const apiService = new ApiService<ProfessionData>();

export const useProfession = () => {
  return useQuery<ProfessionData[], Error>(
    "Profession",
    async () => {
      const response = await apiService.getAll("Profession");

      if (!response.data || !Array.isArray(response.data)) {
        console.error("🚨 Error: Datos de profesiones no válidos", response);
        return [];
      }

      return response.data.map((item) => ({
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
