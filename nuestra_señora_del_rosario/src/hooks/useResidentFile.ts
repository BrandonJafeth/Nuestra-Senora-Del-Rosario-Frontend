import { useQuery } from "react-query";
import { ResidentDocument } from "../types/FileResidentType";
import residentDocumentService from "../services/FileResidentService";

export const useResidentDocuments = (residentCedula: string) => {
  return useQuery<ResidentDocument[], Error>({
    queryKey: ['residentDocuments', residentCedula],
    queryFn: async () => {
      const { data } = await residentDocumentService.getDocumentsByCedula(residentCedula);
      return data;
    },
    enabled: !!residentCedula, 
  });
};
