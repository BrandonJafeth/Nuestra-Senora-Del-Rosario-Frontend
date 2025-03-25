import { DependencyLevel } from "../types/DependencyLevelType";
import { useCRUDGeneric } from "./GenericHook/CRUDGeneric";

export const useManagmentDependencyLevel = () => {
  return useCRUDGeneric<DependencyLevel>("/DependencyLevel");
};
