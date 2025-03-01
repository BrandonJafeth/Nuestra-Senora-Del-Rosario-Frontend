import { AppointmentStatus } from "../types/AppointmentStatus";
import ApiService from "./GenericService/ApiService";

class AppointmentStatusService extends ApiService<AppointmentStatus> {

    public getAllAppointmentsStatus() {
      return this.getAll('/AppointmentStatus'); 
    }

    public createAppointmentStatus(appointmentStatus: AppointmentStatus) {
      return this.create('/AppointmentStatus', appointmentStatus);
    }

    public updateAppointmentStatus(id : number, appointmentStatus: AppointmentStatus) {
      return this.putWithoutId(`/AppointmentStatus${id}`, appointmentStatus);
    }

    public deleteAppointmentStatus(id: string) {
      return this.delete('/AppointmentStatus', id);
    }
}

const appointmentStatusService = new AppointmentStatusService();
export default appointmentStatusService;
