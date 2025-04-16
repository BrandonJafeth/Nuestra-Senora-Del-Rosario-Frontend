// hooks/useSpeciality.ts
import { useQuery } from "react-query";
import { Specialty } from "../types/SpecialityType";
import specialtyService from "../services/SpecialityService";

export const useSpeciality = () => {
  return useQuery<Specialty[], Error>(
    "/Specialty",
    async () => {
      const response = await specialtyService.getAllSpecialties();
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
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );
};
