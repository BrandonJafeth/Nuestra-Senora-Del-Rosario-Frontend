import { useQuery } from "react-query";
import { Resident } from "../types/ResidentsType";
import residentsService from "../services/ResidentsService";

export const useResidentInfoById = (id: number) => {
  return useQuery<Resident, Error>(
    ["residentInfo", id], 
    async () => {
      const response = await residentsService.getResidentInfoById(id);
      return response.data; // ✅ Extrae el `data` de la respuesta de Axios
    },
    {
      enabled: !!id, // Evita ejecutar la query si `id` es `null` o `undefined`
      staleTime: 1000 * 60 * 5, // Cachea la respuesta por 5 minutos
      refetchOnWindowFocus: false,
    }
  );
};
