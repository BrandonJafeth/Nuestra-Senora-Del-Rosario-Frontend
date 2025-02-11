

// types/ResidentsType.ts

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
  id_DependencyLevel: number;
  id_Room: number;
}




  export interface ResidentPostType {
    name_AP: string;            // Nombre del residente
    lastname1_AP: string;       // Primer apellido del residente
    lastname2_AP: string;       // Segundo apellido del residente
    cedula_AP: string;          // Cédula del residente
    sexo: string;               // Sexo del residente (Masculino, Femenino)
    fechaNacimiento: string;    // Fecha de nacimiento (Formato ISO)
    id_Guardian: number;        // ID del guardián asociado
    id_Room: number;            // ID de la habitación asignada
    entryDate: string;          // Fecha de entrada (Formato ISO)
    id_DependencyLevel: number; // ID del nivel de dependencia
    location: string;           // Ubicación del residente
    
  }
  
  // types/ResidentPatchDto.ts

export interface ResidentPatchDto {
  id_Room?: number;            // ID de la habitación, opcional
  status?: string;             // Estado del residente, opcional ("Activo", "Inactivo")
  id_DependencyLevel?: number; // Nivel de dependencia, opcional
  fechaNacimiento?: string;    // Fecha de nacimiento en formato string (YYYY-MM-DD), opcional
}
