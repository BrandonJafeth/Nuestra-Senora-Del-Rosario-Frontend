// src/services/ResidentDocumentService.ts
import { ResidentDocument } from '../types/FileResidentType';
import ApiService from './GenericService/ApiService';
import { AxiosResponse } from 'axios';

class ResidentDocumentService extends ApiService<ResidentDocument> {
  constructor() {
    super();
  }

  /**
   * Obtiene los documentos subidos asociados a una cédula específica.
   * @param cedula Cédula del residente
   */
  public getDocumentsByCedula(cedula: string): Promise<AxiosResponse<ResidentDocument[]>> {
    return this.getAll(`/FileUpload/list/${cedula}`);
  }
}

const residentDocumentService = new ResidentDocumentService();
export default residentDocumentService;
