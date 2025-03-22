
import { AdministrationRouteType } from "../types/AdministrationRouteType";
import { useCRUDGeneric } from "./GenericHook/CRUDGeneric";

export const useManagmentAdministrationRoute = () => {
  return useCRUDGeneric<AdministrationRouteType>("/AdministrationRoute");
};
