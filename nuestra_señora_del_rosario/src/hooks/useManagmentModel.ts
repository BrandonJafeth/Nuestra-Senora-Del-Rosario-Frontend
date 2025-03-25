
import { ModelType } from "../types/ModelType";
import { useCRUDGeneric } from "./GenericHook/CRUDGeneric";

export const useManagmentModel = () => {
  return useCRUDGeneric<ModelType>("/Model");
};
