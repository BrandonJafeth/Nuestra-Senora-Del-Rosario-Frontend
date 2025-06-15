
import { HealthcareCenter } from "../types/HealthcareCenter";
import { useCRUDGeneric } from "./GenericHook/CRUDGeneric";

export const useManagmentHealtcareCenter = () => {
  return useCRUDGeneric<HealthcareCenter>("/HealthcareCenter");
};
