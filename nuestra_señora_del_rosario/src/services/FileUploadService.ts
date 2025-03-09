// src/services/FileUploadService.ts
import ApiService from './GenericService/ApiService';
import { FileUploadResponse } from '../types/FileUploadType';

class FileUploadService extends ApiService<FileUploadResponse> {
  public uploadFile(cedula: string, file: File) {
    const formData = new FormData();
    formData.append('file', file); // <-- IMPORTANTE: "file" debe coincidir con el servidor

    // Llamada directa a axios sin headers adicionales (axios los configura automáticamente)
    return this.create(`/FileUpload/upload/${cedula}`, formData as unknown as FileUploadResponse);
  }
}

const fileUploadService = new FileUploadService();
export default fileUploadService;
