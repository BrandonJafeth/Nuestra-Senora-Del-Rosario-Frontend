import { useQuery } from "react-query";
import { HealthcareCenter } from "../types/HealthcareCenter";
import ApiService from "../services/GenericService/ApiService";

const apiService = new ApiService<HealthcareCenter>();

export const useHealthcareCenters = () => {
  return useQuery<HealthcareCenter[], Error>(
    "HealthcareCenter", // ✅ Debe coincidir con la key en `invalidateQueries`
    async () => {
      const response = await apiService.getAll("HealthcareCenter");

      if (!response.data || !Array.isArray(response.data)) {
        console.error("🚨 Error: Datos de centros de atención no válidos", response);
        return [];
      }

      return response.data.map((item) => ({
        id_HC: item.id_HC ?? 0,
        name_HC: item.name_HC || "Sin nombre",
        location_HC: item.location_HC || "Ubicación desconocida",
        type_HC: item.type_HC || "Desconocido",
      }));
    },
    {
      staleTime: 5 * 60 * 1000, // Cache por 5 minutos
      cacheTime: 10 * 60 * 1000, // Almacenar en caché por 10 minutos
    }
  );
};
