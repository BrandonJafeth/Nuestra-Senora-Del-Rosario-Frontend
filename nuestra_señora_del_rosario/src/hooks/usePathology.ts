import { useQuery } from "react-query";
import pathologysService from "../services/PathologyService";

export const usePathologies = () => {
    return useQuery('pathologies', pathologysService.getAllPathologies, {
      staleTime: 1000 * 60 * 5, // Cache de 5 minutos
      refetchOnWindowFocus: false,
    });
  };