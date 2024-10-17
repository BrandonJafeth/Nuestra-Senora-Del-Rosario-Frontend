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
  