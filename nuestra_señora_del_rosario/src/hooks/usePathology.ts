import { useQuery } from "react-query";
import { Pathology } from "../types/PathologyType";
import ApiService from "../services/GenericService/ApiService";

const apiService = new ApiService<Pathology>();

export const usePathologies = () => {
  return useQuery<Pathology[], Error>(
    "Pathology", // ✅ Debe coincidir con la key en `invalidateQueries`
    async () => {
      const response = await apiService.getAll("Pathology");

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
