import ApiService from './GenericService/ApiService'; // Asegúrate de que la ruta sea correcta
import { VoluntarieType } from '../types/VoluntarieType'; // Asegúrate de que la ruta sea correcta

class VolunteerSectionService extends ApiService<VoluntarieType> {
  constructor() {
    super(); // Usa la URL base desde el genérico
  }

  // Método específico para obtener todos los tipos de voluntariado
  public getAllVolunteerTypes() {
    return this.getAll('/VoluntarieType');
  }
}

const volunteerSectionServiceInstance = new VolunteerSectionService();
export default volunteerSectionServiceInstance;
