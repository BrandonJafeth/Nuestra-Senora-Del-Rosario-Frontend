// src/services/ResidentDocumentService.ts
import { ResidentDocument } from '../types/FileResidentType';
import ApiService from './GenericService/ApiService';
import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

class ResidentDocumentService extends ApiService<ResidentDocument> {
  constructor() {
    super();
  }

  /**
   * Obtiene los documentos subidos asociados a una cédula específica.
   * @param cedula Cédula del residente
   */
  public getDocumentsByCedula(cedula: string): Promise<AxiosResponse<ResidentDocument[]>> {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');

    return this.getWithHeaders<ResidentDocument[]>(`/FileUpload/list/${cedula}`, {
      Authorization: `Bearer ${token}`,
    });
  }
}

const residentDocumentService = new ResidentDocumentService();
export default residentDocumentService;
