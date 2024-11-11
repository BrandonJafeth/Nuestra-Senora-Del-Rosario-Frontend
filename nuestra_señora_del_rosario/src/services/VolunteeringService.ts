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
    return this.getAll('/FormVoluntarie');
  }

  public getAllVolunteerPages(page: number, pageSize: number) {
    return this.getAllPages('/FormVoluntarie', page, pageSize);
  }

  public getVolunteerRequestById(id: number) {
    return this.getOne('/FormVoluntarie', id);
  }

  public createVolunteerRequest(data: VolunteerRequest) {
    return this.create('/FormVoluntarie', data);
  }

  public updateVolunteerRequest(id: number, data: Partial<VolunteerRequest>) {
    return this.patch(`/FormVoluntarie/${id}/status`, id, data); 
  }

  public deleteVolunteerRequest(id: number) {
    return this.delete('/FormVoluntarie', id);
  }
}

const volunteeringService = new VolunteeringService();
export default volunteeringService;
