// src/services/AppointmentService.ts
import ApiService from './GenericService/ApiService';
import { AppointmentUpdateDto } from '../types/AppointmentType';

class AppointmentService extends ApiService<AppointmentUpdateDto> {
  public updateAppointment(id: number, data: Partial<AppointmentUpdateDto>) {
    console.log("Actualizando cita:", { id, data }); // Verifica los datos antes del envío
    return this.patch(`/Appointment`, id, data); // Verifica que la URL sea correcta
  }
}

const appointmentService = new AppointmentService();
export default appointmentService;
