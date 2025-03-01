import { ProfessionData } from "../types/ProfessionType";
import ApiService from "./GenericService/ApiService";

class ProfessionService extends ApiService<ProfessionData> {
  public getAllProfession() {
    return this.getAll('/Profession');
  }

  public createProfession(data: ProfessionData) {
    return this.create('/Profession', data);
  }

  public updateProfession(id : number, data: ProfessionData) {
    return this.putWithoutId(`/Profession/${id}`, data);
  }

  public deleteProfession(id: string) {
    return this.delete('/Profession', id);
  }
}

const professionService = new ProfessionService();
export default professionService;

