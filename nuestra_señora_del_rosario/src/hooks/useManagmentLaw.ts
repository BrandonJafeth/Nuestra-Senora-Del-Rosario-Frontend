
import { LawType } from "../types/LawType";
import { useCRUDGeneric } from "./GenericHook/CRUDGeneric";

export const useManagmentLaw = () => {
  return useCRUDGeneric<LawType>("Law");
};
