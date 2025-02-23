
import { useMutation } from "react-query";
import residentPathologyService from "../services/ResidentPathologyService";
import { ResidentPathology } from "../types/ResidentPathology";

export const useUpdateResidentPathology = () => {
  return useMutation(
    ({ id, data }: { id: number; data: Partial<ResidentPathology> }) =>
      residentPathologyService.updateResidentPathology(id, data)
  );
};
