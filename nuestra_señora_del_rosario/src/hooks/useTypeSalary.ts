import { useQuery } from "react-query";
import { TypeSalaryData } from "../types/TypeSalaryType";
import ApiService from "../services/GenericService/ApiService";
import { ApiResponse } from "../types/AssetsCategoryType";

const apiService = new ApiService<TypeSalaryData>();

export const useTypeSalary = () => {
  return useQuery<TypeSalaryData[], Error>(
    "TypeOfSalary",
    async () => {
      const response = await apiService.getAll("TypeOfSalary") as unknown as { data: ApiResponse<TypeSalaryData[]> };

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
      staleTime: 5 * 60 * 1000, // Cache por 5 minutos
      cacheTime: 10 * 60 * 1000, // Almacenar en caché por 10 minutos
    }
  );
};
