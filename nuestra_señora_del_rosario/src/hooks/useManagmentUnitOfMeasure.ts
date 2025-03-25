import { UnitOfMeasure } from "../types/UnitOfMeasureType";
import { useCRUDGeneric } from "./GenericHook/CRUDGeneric";

export const useManagmentUnitOfMeasure = () => {
  return useCRUDGeneric<UnitOfMeasure>("/UnitOfMeasure");
};
