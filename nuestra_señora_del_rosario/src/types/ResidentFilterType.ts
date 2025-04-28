// types/ResidentFilterType.ts
import { Resident } from "./ResidentsType";

export interface ResidentFilter {
  nombre?: string;
  apellido1?: string;
  apellido2?: string;
  cedula?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface ResidentFilterResponse {
  residents: Resident[];
  totalPages: number;
}