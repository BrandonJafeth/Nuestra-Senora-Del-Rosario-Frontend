import { useQuery } from "react-query";
import { MedicalHistory } from "../types/MedicalHistoryType";
import medicalHistorysService from "../services/MedicalHistoryService";

export const useMedicalHistoryById = (residentId: number) => {
  return useQuery<MedicalHistory, Error>(
    ["medicalHistory", residentId], 
    async () => {
      const response = await medicalHistorysService.getMedicalHistoriesById(residentId);
      return response.data; 
    },
    
    {
      enabled: !!residentId, // Evita ejecutar la query si `id` es `null` o `undefined`
      staleTime: 1000 * 60 * 5, // Cachea la respuesta por 5 minutos
      refetchOnWindowFocus: false,
    }
  );
};
