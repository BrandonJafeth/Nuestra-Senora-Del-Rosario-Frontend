import { useQuery } from "react-query";
import professionService from "../services/ProfessionService";
import { ProfessionData } from "../types/ProfessionType";

export const useProfession = () => {
  return useQuery<ProfessionData[], Error>("professions", async () => {
    const response = await professionService.getAllProfession();
    
    if (!response.data || !Array.isArray(response.data)) {
      console.error("❌ Error: Datos de profesiones no válidos", response);
      return [];
    }

    return response.data.map((item) => ({
      id_Profession: item.id_Profession ?? 0, // Asegurar que el ID existe
      name_Profession: item.name_Profession || "Desconocido", // Evitar valores nulos
    }));
  });
};
