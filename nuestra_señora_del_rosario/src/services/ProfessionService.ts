import { ProfessionData } from "../types/ProfessionType";
import ApiService from "./GenericService/ApiService";

class ProfessionService extends ApiService<ProfessionData> {
  public getAllProfession() {
    return this.getAll('/Profession');
  }
}

const professionService = new ProfessionService();
export default professionService;

