// src/services/DependencyLevelService.ts
import ApiService from './GenericService/ApiService';
import { DependencyLevel } from '../types/DependencyLevelType';
import Cookies from 'js-cookie';

class DependencyLevelService extends ApiService<DependencyLevel> {
  public getAllDependencyLevels() {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.getWithHeaders<DependencyLevel[]>('/DependencyLevel', {
      Authorization: `Bearer ${token}`,
    });
  }

  public getDependencyLevelById(id: number) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.getWithHeaders<DependencyLevel>(`/DependencyLevel/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  public createDependencyLevel(data: DependencyLevel) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.postWithHeaders('/DependencyLevel', data, {
      Authorization: `Bearer ${token}`,
    });
  }

  public updateDependencyLevel(id: number, data: Partial<DependencyLevel>) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.updateWithHeaders(`/DependencyLevel/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  public deleteDependencyLevel(id: number) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.deleteWithHeaders('/DependencyLevel', id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const dependencyLevelService = new DependencyLevelService();
export default dependencyLevelService;
