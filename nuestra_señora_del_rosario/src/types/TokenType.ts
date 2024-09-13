
// Definimos la estructura del token decodificado
export interface DecodedToken {
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string; 
    exp: number;  
  }