
import { TypeSalaryData } from "../types/TypeSalaryType";
import { useCRUDGeneric } from "./GenericHook/CRUDGeneric";

export const useManagmentTypeSalary = () => {
  return useCRUDGeneric<TypeSalaryData>("/TypeOfSalary");
};
