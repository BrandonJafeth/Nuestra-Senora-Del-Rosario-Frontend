import { TypeSalaryData } from "../types/TypeSalaryType";
import ApiService from "./GenericService/ApiService";

class TypeSalaryService extends ApiService<TypeSalaryData> {
  public getAllTypeSalary() {
    return this.getAll('/TypeOfSalary');
  }

  public createTypeSalary(data: TypeSalaryData) {
    return this.create('/TypeOfSalary', data);
  }

  public updateTypeSalary(id: number, data: Partial<TypeSalaryData>) {
    return this.putWithoutId(`/TypeOfSalary/${id}`, data);
  }

  public deleteTypeSalary(id: number) {
    return this.delete('/TypeOfSalary', id);
  }
}

const typeSalaryService = new TypeSalaryService();

export default typeSalaryService;

