// types/UserFilterType.ts
import { UserData } from "./UserType";

export interface UserFilter {
  nombre?: string;
  apellido1?: string;
  apellido2?: string;
  cedula?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface UserFilterResponse {
  users: UserData[];
  totalPages: number;
}