
import { useMutation } from "react-query";
import { ResidentPathology } from "../types/ResidentPathology";
import residentMedicationService from "../services/ResidentMedicationService";

export const useUpdateResidentMedication = () => {
  return useMutation(
    ({ id, data }: { id: number; data: Partial<ResidentPathology> }) =>
      residentMedicationService.updateResidentMedication(id, data)
  );
};
