import { AppointmentStatus } from "../types/AppointmentStatus";
import ApiService from "./GenericService/ApiService";
import Cookies from 'js-cookie';

class AppointmentStatusService extends ApiService<AppointmentStatus> {
  public getAllAppointmentsStatus() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.getWithHeaders<AppointmentStatus[]>('/AppointmentStatus', {
      Authorization: `Bearer ${token}`,
    });
  }
  

  public async createAppointmentStatus(data: AppointmentStatus) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
  
    return this.postWithHeaders<AppointmentStatus>('/AppointmentStatus', data, {
      Authorization: `Bearer ${token}`,
    });
  }
  

  public updateAppointmentStatus(id: number, appointmentStatus: AppointmentStatus) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.updateWithHeaders(`/AppointmentStatus/${id}`, appointmentStatus, {
      Authorization: `Bearer ${token}`,
    });
  }

  public deleteAppointmentStatus(id: string) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // Usar deleteWithHeaders
    return this.deleteWithHeaders('/AppointmentStatus', id, {
      Authorization: `Bearer ${token}`,
    });
  }
}

const appointmentStatusService = new AppointmentStatusService();
export default appointmentStatusService;
