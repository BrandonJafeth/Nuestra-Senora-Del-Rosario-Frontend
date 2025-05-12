import { useQuery } from "react-query";
import administrationRouteService from "../services/AdministrationRouteService";
import { AdministrationRouteType } from "../types/AdministrationRouteType";

export const useAdministrationRoute = () => {
  return useQuery<AdministrationRouteType[], Error>(
    "/AdministrationRoute",
    async () => {
      const page = 1; // Define the default page number
      const pageSize = 10; // Define the default page size
      const response = await administrationRouteService.getAllAplicationPages(page, pageSize);

      // Si tu backend retorna algo tipo: { data: [...] }
      // ajusta la lectura del array
      return response.data; // O .data.Data, según tu respuesta real
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );
};
