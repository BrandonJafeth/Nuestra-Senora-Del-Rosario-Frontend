// src/services/FileUploadService.ts
import ApiService from './GenericService/ApiService';
import { FileUploadResponse } from '../types/FileUploadType';
import Cookies from 'js-cookie';

class FileUploadService extends ApiService<FileUploadResponse> {
  // Método para subir un archivo con token
  public uploadFile(cedula: string, file: File) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    
    const formData = new FormData();
    formData.append('file', file);

    return this.postWithHeaders<FileUploadResponse>(
      `/FileUpload/upload/${cedula}`,
      formData,
      { Authorization: `Bearer ${token}` }
    );
  }

  // Método para renombrar un archivo con token
  public renameFile(fileId: string, newName: string) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');

    // Se usa directamente la instancia de axios (this.api) para pasar headers
    return this.updateWithHeaders(
      `/FileUpload/rename/${fileId}?newName=${encodeURIComponent(newName)}`,
      {},
      { Authorization: `Bearer ${token}` }
    );
  }

  // Método para eliminar un archivo con token
  public deleteFile(fileId: string) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    
    return this.deleteWithHeaders(
      `/FileUpload/delete`,
      fileId,
      { Authorization: `Bearer ${token}` }
    );
  }
}

const fileUploadService = new FileUploadService();
export default fileUploadService;
