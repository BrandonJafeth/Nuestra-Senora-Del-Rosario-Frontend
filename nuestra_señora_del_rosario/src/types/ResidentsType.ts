

// types/ResidentsType.ts

import { Appointment } from "./AppointmentType";
import { ResidentMedication } from "./ResidentMedicationType";
import { ResidentPathology } from "./ResidentPathology";

export interface Resident {
  id_Resident: number;
  name_RD: string;
  lastname1_RD: string;
  lastname2_RD: string;
  cedula_RD: string;
  sexo: string;
  fechaNacimiento: string; // Formato de fecha
  guardianName: string;
  guardianPhone: string;
  roomNumber: string;
  status: string; // Activo o Inactivo
  entryDate: string; // Formato de fecha
  dependencyLevel: string; // Nivel de dependencia (Alto, Medio, Bajo)
  location_RD: string; // Ubicación del residente
  edad: number;
  age: number;
  id_DependencyLevel: number;
  id_Room: number;
  medications : ResidentMedication[]
  pathologies : ResidentPathology[]
  appointments : Appointment[]
}

export interface ResidentPostFromApplicantForm {
  id_ApplicationForm: number; 
  id_Room: number; 
  entryDate: string; // Formato ISO: "YYYY-MM-DDTHH:mm:ss.sssZ"
  sexo: string; 
  id_DependencyLevel: number; 
  fechaNacimiento: string; // Formato ISO
}

  export interface ResidentPostType {
    name_RD: string;            // Nombre del residente
    lastname1_RD: string;       // Primer apellido del residente
    lastname2_RD: string;       // Segundo apellido del residente
    cedula_RD: string;          // Cédula del residente
    sexo: string;               // Sexo del residente (Masculino, Femenino)
    fechaNacimiento: string;    // Fecha de nacimiento (Formato ISO)
    id_Guardian: number;        // ID del guardián asociado
    id_Room: number;            // ID de la habitación asignada
    entryDate: string;          // Fecha de entrada (Formato ISO)
    id_DependencyLevel: number; // ID del nivel de dependencia
    location_RD: string;           // Ubicación del residente
  }
  
  // types/ResidentPatchDto.ts

export interface ResidentPatchDto {
  id_Room?: number;            // ID de la habitación, opcional
  status?: string;             // Estado del residente, opcional ("Activo", "Inactivo")
  id_DependencyLevel?: number; // Nivel de dependencia, opcional
  fechaNacimiento?: string;    // Fecha de nacimiento en formato string (YYYY-MM-DD), opcional
}
