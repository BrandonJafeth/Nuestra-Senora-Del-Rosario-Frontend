// src/services/FileUploadService.ts
import ApiService from './GenericService/ApiService';
import { FileUploadResponse } from '../types/FileUploadType';

class FileUploadService extends ApiService<FileUploadResponse> {
  public uploadFile(cedula: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.create(`/FileUpload/upload/${cedula}`, formData as unknown as FileUploadResponse);
  }

  // ✅ Método corregido y bien definido
  public renameFile(fileId: string, newName: string) {
    // Se manda como parámetro en query string, no en body
    return this.putWithoutId(`/FileUpload/rename/${fileId}?newName=${encodeURIComponent(newName)}`, {});
  }

  // FileUploadService.ts
public deleteFile(fileId: string) {
  return this.delete(`/FileUpload/delete`, fileId);
}

}

const fileUploadService = new FileUploadService();
export default fileUploadService;
