

import { MedicationSpecific } from "../types/MedicationSpecificType";
import { useCRUDGeneric } from "./GenericHook/CRUDGeneric";

export const useManagmentMedication = () => {
  return useCRUDGeneric<MedicationSpecific>("/MedicationSpecific");
};
