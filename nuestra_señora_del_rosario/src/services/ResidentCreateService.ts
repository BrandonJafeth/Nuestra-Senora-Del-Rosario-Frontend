// services/ResidentCreateService.ts
import ApiService from './GenericService/ApiService';
import { ResidentPostType } from '../types/ResidentsType';

class ResidentCreateService extends ApiService<ResidentPostType> {
  constructor() {
    super();
  }



  // Crear un nuevo residente
  public createResident(data: ResidentPostType) {
    return this.create('/Residents', data); // Usar ResidentPostType para crear un residente
  }

}

const residentCreateService = new ResidentCreateService();
export default residentCreateService;
