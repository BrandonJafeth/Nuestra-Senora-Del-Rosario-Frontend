import { useQuery } from "react-query";
import employeeService from "../services/EmployeeService";
import { EmployeeType } from "../types/EmployeeType";

/**
 * Hook para obtener empleados por una o varias profesiones usando React Query.
 * @param professionIds ID o lista de IDs de profesiones.
 */
export const useEmployeesByProfession = (professionIds: number | number[]) => {
  return useQuery<EmployeeType[], Error>(
    ["employeesByProfession", professionIds],
    async () => {
      const response = await employeeService.getEmployeesByProfession(professionIds);
      return response.data;
    },
    {
      enabled: !!professionIds, // Solo ejecuta la consulta si hay IDs válidos
      staleTime: 1000 * 60 * 5, // 5 minutos antes de volver a refetch
      cacheTime: 1000 * 60 * 10, // 10 minutos en caché
      retry: 2, // Intenta 2 veces en caso de error
    }
  );
};
