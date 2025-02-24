
import { useMutation } from "react-query";
import { MedicalHistory } from "../types/MedicalHistoryType";
import medicalHistorysService from "../services/MedicalHistoryService";

export const useUpdateMedicalHistory = () => {
  return useMutation(
    ({ id, data }: { id: number; data: Partial<MedicalHistory> }) =>
        medicalHistorysService.updateMedicalHistories(id, data)
  );
};
