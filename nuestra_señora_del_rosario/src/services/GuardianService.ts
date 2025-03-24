// services/GuardianService.ts
import ApiService from './GenericService/ApiService';
import { Guardian } from '../types/GuardianType';
import Cookies from 'js-cookie';

class GuardianService extends ApiService<Guardian> {
  constructor() {
    super();
  }

  // Obtener todos los guardianes con token
  public getAllGuardians() {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.getWithHeaders<Guardian[]>('/Guardian', {
      Authorization: `Bearer ${token}`,
    });
  }

  // Obtener un guardián por ID con token
  public getGuardianById(id: number) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.getWithHeaders<Guardian>(`/Guardian/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Crear un nuevo guardián con token
  public createGuardian(data: Guardian) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.postWithHeaders('/Guardian', data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Actualizar un guardián existente con token
  public updateGuardian(id: number, data: Partial<Guardian>) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.patchWithHeaders(`/Guardian/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Eliminar un guardián con token
  public deleteGuardian(id: number) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.deleteWithHeaders('/Guardian', id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const guardianService = new GuardianService();
export default guardianService;
