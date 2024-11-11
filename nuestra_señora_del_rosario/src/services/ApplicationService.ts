// services/ApplicationService.ts
import ApiService from './GenericService/ApiService'; // Asegúrate de que la ruta sea correcta
import { ApplicationRequest } from '../types/ApplicationType'; // Asegúrate de que la ruta sea correcta

class ApplicationService extends ApiService<ApplicationRequest> {
  constructor() {
    super(); // Usa la URL base desde el genérico
  }

  // Métodos específicos para solicitudes de ingreso
  public getAllApplicationRequests() {
    return this.getAll('/ApplicationForm');
  }

  public getApplicationRequestById(id: number) {
    return this.getOne('/ApplicationForm', id);
  }

  public getAllAplicationPages(page: number, pageSize: number) {
    return this.getAllPages('/ApplicationForm', page, pageSize);
  }

  public createApplicationRequest(data: ApplicationRequest) {
    return this.create('/ApplicationForm', data);
  }

  public updateApplicationRequest(id: number, data: Partial<ApplicationRequest>) {
    return this.patch(`/ApplicationForm/${id}`, id, data); 
  }

  public deleteApplicationRequest(id: number) {
    return this.delete('/ApplicationForm', id);
  }
}

const applicationService = new ApplicationService();
export default applicationService;
