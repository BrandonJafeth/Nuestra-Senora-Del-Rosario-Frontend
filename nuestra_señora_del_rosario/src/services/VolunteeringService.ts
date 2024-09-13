import ApiService from './GenericService/ApiService'; // Asegúrate de que la ruta sea correcta
import { VolunteerRequest } from '../types/VolunteerType'; // Asegúrate de que la ruta sea correcta

class VolunteeringService extends ApiService<VolunteerRequest> {
  getAllVolunteeringService() {
      throw new Error('Method not implemented.');
  }
  constructor() {
    super(); // Usa la URL base desde el genérico
  }

  // Métodos específicos del voluntariado
  public getAllVolunteerRequests() {
    return this.getAll('/AdministrativeFormVoluntarie');
  }

  public getVolunteerRequestById(id: number) {
    return this.getOne('/AdministrativeFormVoluntarie', id);
  }

  public createVolunteerRequest(data: VolunteerRequest) {
    return this.create('/AdministrativeFormVoluntarie', data);
  }

  public updateVolunteerRequest(id: number, data: Partial<VolunteerRequest>) {
    return this.update('/AdministrativeFormVoluntarie', id, data);
  }

  public deleteVolunteerRequest(id: number) {
    return this.delete('/AdministrativeFormVoluntarie', id);
  }
}

const volunteeringService = new VolunteeringService();
export default volunteeringService;
