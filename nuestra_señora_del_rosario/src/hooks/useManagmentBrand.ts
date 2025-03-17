
import { BrandType } from "../types/BrandType";
import { useCRUDGeneric } from "./GenericHook/CRUDGeneric";

export const useManagmentBrand = () => {
  return useCRUDGeneric<BrandType>("Brand");
};
