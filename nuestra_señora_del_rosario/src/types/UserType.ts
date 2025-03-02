export interface UserData {
    [x: string]: any;
    dniEmployee: number;
    password: string;
  }

export interface UserResponse {
    token: string;  
    userId: number; 
    // Otros campos de la respuesta del backend
  }
  export interface User {
    id_User: number;
    id_Role: number;
    dni: number;
    email: string;
    fullName: string;
    password: string;
    is_Active: boolean;
    isActive: boolean;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    roles: string[];
    totalPages? : number;
    users ?: User[];
  }
  
  export interface UserResponsePages {
   totalPages: number; // Total de usuarios
    users: User[]; // Lista de usuarios
  }
  
  export interface AssignRoleRequest {
    message: string;
    id_User: number;
    id_Role: number;
  }
  
  export interface AssignRoleResponse {
    success: boolean;
    message: string;
  }
  