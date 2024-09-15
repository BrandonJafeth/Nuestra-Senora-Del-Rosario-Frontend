import { TypeSalaryData } from "../types/TypeSalaryType";
import ApiService from "./GenericService/ApiService";

class TypeSalaryService extends ApiService<TypeSalaryData> {
  public getAllTypeSalary() {
    return this.getAll('/TypeOfSalary');
  }
}

const typeSalaryService = new TypeSalaryService();
export default typeSalaryService;