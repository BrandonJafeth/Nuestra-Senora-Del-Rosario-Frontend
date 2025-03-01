import { useQuery } from "react-query";
import ApiService from "../services/GenericService/ApiService";
import { Specialty } from "../types/SpecialityType";

const apiService = new ApiService<Specialty>();

export const useSpeciality = () => {
  return useQuery<Specialty[], Error>(
    "Specialty", // ✅ Debe coincidir con la key en `invalidateQueries`
    async () => {
      const response = await apiService.getAll("Specialty");

      if (!response.data || !Array.isArray(response.data)) {
        console.error("🚨 Error: Datos de especialidades médicas no válidos", response);
        return [];
      }

      return response.data.map((item) => ({
        id_Specialty: item.id_Specialty ?? 0,
        name_Specialty: item.name_Specialty || "Desconocido",
      }));
    },
    {
      staleTime: 5 * 60 * 1000, // Cache por 5 minutos
      cacheTime: 10 * 60 * 1000, // Almacenar en caché por 10 minutos
    }
  );
};
