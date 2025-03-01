import { useQuery } from "react-query";

import { TypeSalaryData } from "../types/TypeSalaryType";
import ApiService from "../services/GenericService/ApiService";

const apiService = new ApiService<TypeSalaryData>();

export const useTypeSalary = () => {
  return useQuery<TypeSalaryData[], Error>(
    "TypeOfSalary",
    async () => {
      const response = await apiService.getAll("TypeOfSalary");

      if (!response.data || !Array.isArray(response.data)) {
        console.error("🚨 Error: Datos de tipos de salario no válidos", response);
        return [];
      }

      return response.data.map((item) => ({
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
