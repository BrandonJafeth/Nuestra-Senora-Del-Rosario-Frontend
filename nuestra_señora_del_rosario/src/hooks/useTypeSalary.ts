import { useQuery } from "react-query";
import { TypeSalaryData } from "../types/TypeSalaryType";
import typeSalaryService from "../services/TypeSalaryService"; // Importa el service específico
import { ApiResponse } from "../types/AssetsCategoryType";

export const useTypeSalary = () => {
  return useQuery<TypeSalaryData[], Error>(
    "/TypeOfSalary",
    async () => {
      const response = await typeSalaryService.getAllTypeSalary() as unknown as { data: ApiResponse<TypeSalaryData[]> };

      if (!response.data?.data || !Array.isArray(response.data.data)) {
        console.error("🚨 Error: Datos de tipos de salario no válidos", response);
        return [];
      }

      return response.data.data.map((item) => ({
        id_TypeOfSalary: item.id_TypeOfSalary ?? 0,
        name_TypeOfSalary: item.name_TypeOfSalary || "Sin nombre",
      }));
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );
};
