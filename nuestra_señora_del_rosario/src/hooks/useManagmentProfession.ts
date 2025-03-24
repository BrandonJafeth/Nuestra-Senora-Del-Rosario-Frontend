
import { ProfessionData } from "../types/ProfessionType";
import { useCRUDGeneric } from "./GenericHook/CRUDGeneric";

export const useManagmentProfession = () => {
  return useCRUDGeneric<ProfessionData>("/Profession");
};
