// services/DependencyLevelService.ts

import ApiService from './GenericService/ApiService';
import { DependencyLevel } from '../types/DependencyLevelType';

class DependencyLevelService extends ApiService<DependencyLevel> {

  public getAllDependencyLevels() {
    return this.getAll('/DependencyLevel'); // Cambia la ruta según tu API
  }

  // Obtener un nivel de dependencia por su ID
  public getDependencyLevelById(id: number) {
    return this.getOne('/DependencyLevel', id); // Cambia la ruta según tu API
  }

  // Crear un nuevo nivel de dependencia
  public createDependencyLevel(data: DependencyLevel) {
    return this.create('/DependencyLevel', data); // Cambia la ruta según tu API
  }

  // Actualizar un nivel de dependencia existente
  public updateDependencyLevel(id: number, data: Partial<DependencyLevel>) {
    return this.update('/DependencyLevel', id, data); // Cambia la ruta según tu API
  }

  // Eliminar un nivel de dependencia por su ID
  public deleteDependencyLevel(id: number) {
    return this.delete('/DependencyLevel', id); // Cambia la ruta según tu API
  }
}

const dependencyLevelService = new DependencyLevelService();
export default dependencyLevelService;
