// types/UserFilterType.ts
import { UserData } from "./UserType";

export interface UserFilter {
  nombre?: string;
  apellido1?: string;
  apellido2?: string;
  cedula?: string;
  tipoUsuario?: string; // Added this field to fix the type error
  pageNumber?: number;
  pageSize?: number;
}

export interface UserFilterResponse {
  users: UserData[];
  totalPages: number;
}