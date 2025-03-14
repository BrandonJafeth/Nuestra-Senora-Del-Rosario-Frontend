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
      enabled: !!residentId, // Sólo se ejecuta si residentId es válido
      staleTime: 5 * 60 * 1000, // Cachea la respuesta por 5 minutos
      refetchOnWindowFocus: false,
      refetchInterval: 5000, // Refresca la data cada 5 segundos (ajusta según tus necesidades)
    }
  );
};
