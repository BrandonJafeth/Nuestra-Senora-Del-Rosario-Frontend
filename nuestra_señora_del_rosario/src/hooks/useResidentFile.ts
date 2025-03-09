import { useQuery } from "react-query";
import { ResidentDocument } from "../types/FileResidentType";
import residentDocumentService from "../services/FileResidentService";

export const useResidentDocuments = (residentName: string) => {
  return useQuery<ResidentDocument[], Error>({
    queryKey: ['residentDocuments', residentName],
    queryFn: async () => {
      const { data } = await residentDocumentService.getDocumentsByCedula(residentName);
      return data;
    },
    enabled: !!residentName, 
  });
};
