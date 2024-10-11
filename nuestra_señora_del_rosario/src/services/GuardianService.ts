


// services/GuardianService.ts
import ApiService from './GenericService/ApiService';
import { Guardian } from '../types/GuardianType';

class GuardianService extends ApiService<Guardian> {
  constructor() {
    super(); // Utilizar el constructor base de ApiService
  }

  // Obtener todos los guardianes
  public getAllGuardians() {
    return this.getAll('/Guardian');
  }

  // Obtener un guardián por ID
  public getGuardianById(id: number) {
    return this.getOne('/Guardian', id);
  }

  // Crear un nuevo guardián
  public createGuardian(data: Guardian) {
    return this.create('/Guardian', data);
  }

  // Actualizar un guardián existente
  public updateGuardian(id: number, data: Partial<Guardian>) {
    return this.patch(`/Guardian/${id}`, id, data); // Usar patch para actualizaciones parciales
  }

  // Eliminar un guardián
  public deleteGuardian(id: number) {
    return this.delete('/Guardian', id);
  }
}

const guardianService = new GuardianService();
export default guardianService;
