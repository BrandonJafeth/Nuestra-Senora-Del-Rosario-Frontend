


// services/ModelService.ts
import { ModelType } from '../types/ModelType';
import ApiService from './GenericService/ApiService';


class ModelService extends ApiService<ModelType> {
  constructor() {
    super(); // Usa la URL base desde el genérico
  }

  public getAllModels() {
    return this.getAll('/Model');
  }

  public getModelById(id: number) {
    return this.getOne('/Model', id); 
  }

  public createModel(data: ModelType) {
    return this.create('/Model', data); 
  }

  public updateModel(id: number, data: Partial<ModelType>) {
    return this.patch(`/Model/${id}`, id, data); // Cambia la ruta según tu API
  }

  public deleteModel(id: number) {
    return this.delete('/Model', id); // Cambia la ruta según tu API
  }
}

const modelService = new ModelService();
export default modelService;
