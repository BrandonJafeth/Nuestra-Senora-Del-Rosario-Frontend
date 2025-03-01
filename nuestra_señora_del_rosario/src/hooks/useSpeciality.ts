import { useQuery } from "react-query";
import { Specialty } from "../types/SpecialityType";
import specialtyService from "../services/SpecialityService";

export const useSpeciality = () => {
  return useQuery<Specialty[], Error>("specialities", async () => {
    const response = await specialtyService.getAllSpecialties();
    
    if (!response.data || !Array.isArray(response.data)) {
      console.error("❌ Error: Datos de especialidades médicas no válidos", response);
      return [];
    }

    return response.data.map((item) => ({
      id_Specialty: item.id_Specialty ?? 0, // Asegurar que el ID existe
      name_Specialty: item.name_Specialty || "Desconocido", // Evitar valores nulos
    }));
  });
};
