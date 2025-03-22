import { Pathology } from "../types/PathologyType";
import { useCRUDGeneric } from "./GenericHook/CRUDGeneric";

export const useManagmentPathologies = () => {
  return useCRUDGeneric<Pathology>("/Pathology");
};
