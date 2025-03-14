import { useMutation, useQueryClient } from "react-query";
import { MedicalHistory } from "../types/MedicalHistoryType";
import medicalHistorysService from "../services/MedicalHistoryService";

export const useUpdateMedicalHistory = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, data }: { id: number; data: Partial<MedicalHistory> }) =>
      medicalHistorysService.updateMedicalHistories(id, data),
    {
      onSuccess: (_data, variables) => {
        // Invalida la query para que se refetch automáticamente
        queryClient.invalidateQueries(["medicalHistory", variables.id]);
      },
    }
  );
};
