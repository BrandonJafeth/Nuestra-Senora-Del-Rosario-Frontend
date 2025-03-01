
import { AppointmentStatus } from "../types/AppointmentStatus";
import { useCRUDGeneric } from "./GenericHook/CRUDGeneric";

export const useAppointmentStatusMutation = () => {
  return useCRUDGeneric<AppointmentStatus>("/AppointmentStatus");
};
