import { AppointmentStatus } from "../types/AppointmentStatus";
import ApiService from "./GenericService/ApiService";

class AppointmentStatusService extends ApiService<AppointmentStatus> {

    public getAllAppointmentsStatus() {
      return this.getAll('/AppointmentStatus'); 
    }
}

const appointmentStatusService = new AppointmentStatusService();
export default appointmentStatusService;
