
import { Specialty } from "../types/SpecialityType";
import { useCRUDGeneric } from "./GenericHook/CRUDGeneric";

export const useManagmentSpecialities = () => {
  return useCRUDGeneric<Specialty>("/Specialty");
};
