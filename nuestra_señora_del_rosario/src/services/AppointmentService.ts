import ApiService from './GenericService/ApiService'; 
import { Appointment, AppointmentUpdateDto } from '../types/AppointmentType'; // Ajusta la ruta según tu proyecto.

class AppointmentService extends ApiService<Appointment> {
  constructor() {
    super(); // Llama al constructor de la clase padre.
  }

  public getAllAppointments() {
    return this.getAll('/Appointment');
  }

  public getAppointmentById(id: number) {
    return this.getOne('/Appointment', id);
  }

  public createAppointment(data: Appointment) {
    return this.create('/Appointment', data);
  }

 
    public updateAppointment(id: number, data: Partial<AppointmentUpdateDto>) {
      console.log("Actualizando cita:", { id, data }); // Verifica los datos antes del envío
      return this.patch('/Appointment', id, data); // Verifica que la URL sea correcta
    }
  
  
  public deleteAppointment(id: number) {
    return this.delete('/Appointment', id);
  }
}

const appointmentService = new AppointmentService();
export default appointmentService;


// src/services/AppointmentService.ts



