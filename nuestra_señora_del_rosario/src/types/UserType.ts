


{/*export type UserType = {
    id: number
    name: string
    email: string
    password: string
    role: string
    created_at: string
    updated_at: string
    }*/}

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
  