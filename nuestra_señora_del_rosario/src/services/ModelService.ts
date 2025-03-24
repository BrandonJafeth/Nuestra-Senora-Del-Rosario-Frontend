// services/ModelService.ts
import { ModelType } from '../types/ModelType';
import ApiService from './GenericService/ApiService';
import Cookies from 'js-cookie';

class ModelService extends ApiService<ModelType> {
  constructor() {
    super();
  }

  public getAllModels() {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.getWithHeaders<ModelType[]>('/Model', {
      Authorization: `Bearer ${token}`,
    });
  }

  public getModelById(id: number) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.getWithHeaders<ModelType>(`/Model/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  public createModel(data: ModelType) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.postWithHeaders('/Model', data, {
      Authorization: `Bearer ${token}`,
    });
  }

  public updateModel(id: number, data: Partial<ModelType>) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.patchWithHeaders(`/Model/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  public deleteModel(id: number) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.deleteWithHeaders('/Model', id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const modelService = new ModelService();
export default modelService;
