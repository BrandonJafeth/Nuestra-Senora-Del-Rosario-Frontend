import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../types/TokenType";

// Función para decodificar el token y obtener el rol del usuario
export const decodeTokenRole = (token: string): string => {
  try {
    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
    return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  } catch (error) {
    console.error('Error decodificando el token:', error);
    return ''; 
  }
};
