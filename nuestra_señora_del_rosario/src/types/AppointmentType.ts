export interface Appointment {
  id_Appointment: number;
  residentFullName: string;
  residentCedula: string;
  time: string; // "HH:mm:ss"
  date: string; // ISO date string
  specialtyName: string;
  healthcareCenterName: string;
  companionName: string;
  statusName: string;
  notes?: string;
}


export interface AppointmentUpdateDto {
id_Appointment: number;
date: string; // ISO format 'YYYY-MM-DD'
time: string; // ISO format 'HH:mm:ss'
id_Companion: number;
id_StatusAP: number;
notes:string;
}

