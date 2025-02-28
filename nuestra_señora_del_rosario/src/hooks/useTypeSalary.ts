import { useQuery } from "react-query";
import typeSalaryService from "../services/TypeSalaryService";

export const useTypeSalary = () => {
  return useQuery("typeSalary", async () => {
    const response = await typeSalaryService.getAllTypeSalary();

    if (!response.data || !Array.isArray(response.data)) {
      console.error("Error: Datos de tipo de salario no válidos", response);
      return [];
    }

    return response.data.map((item) => ({
      id_TypeOfSalary: item.id_TypeOfSalary ?? 0, // Asegurar que el ID existe
      name_TypeOfSalary: item.name_TypeOfSalary || "Desconocido",
    }));
  });
};
