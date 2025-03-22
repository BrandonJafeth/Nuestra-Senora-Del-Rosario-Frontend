import { useQuery } from "react-query";
import medicationSpecificService from "../services/MedicationSpecificService";

export const useMedicationSpecific = () => {
    return useQuery('/MedicationSpecific', medicationSpecificService.getAllMedicationSpecific, {
      staleTime: 1000 * 60 * 5, // Cache de 5 minutos
      refetchOnWindowFocus: false,
    });
  };