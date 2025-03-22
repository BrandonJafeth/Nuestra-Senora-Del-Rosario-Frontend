import ApiService from "./GenericService/ApiService";
import { Appointment, AppointmentUpdateDto } from "../types/AppointmentType";
import Cookies from "js-cookie";

class AppointmentService extends ApiService<Appointment> {
  constructor() {
    super();
  }

  public getAllAppointments() {
    const token = Cookies.get("authToken");
    console.log("authToken:", token);
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.getWithHeaders<Appointment[]>('/Appointment', {
      Authorization: `Bearer ${token}`,
    });
  }

  public getAppointmentById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.getWithHeaders<Appointment>(`/Appointment/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  public getAppointmentsByResident(residentId: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.getWithHeaders<Appointment>(`/Appointment/resident/${residentId}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  public createAppointment(data: Appointment) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.postWithHeaders('/Appointment', data, {
      Authorization: `Bearer ${token}`,
    });
  }

  public updateAppointment(id: number, data: Partial<AppointmentUpdateDto>) {
    console.log("Actualizando cita:", { id, data });
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.updateWithHeaders(`/Appointment/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  public deleteAppointment(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.deleteWithHeaders<null>('/Appointment', id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const appointmentService = new AppointmentService();
export default appointmentService;
