// FileUploadTypes.ts

// Respuesta hipotética que podría devolver el backend al subir el archivo
export interface FileUploadResponse {
    success: boolean;
    message: string;
    // Puedes incluir más campos según lo que devuelva tu backend
  }
  
  // Datos necesarios para hacer la subida
  export interface FileUploadType {
    cedula: string;
    file: File;
  }
  