import { Category } from "../types/CategoryType";
import { useCRUDGeneric } from "./GenericHook/CRUDGeneric";

export const useManagmentCategories = () => {
  return useCRUDGeneric<Category>("/Category");
};
