import ApiService from './GenericService/ApiService';
import { EmployeeType } from '../types/EmployeeType';

class EmployeeService extends ApiService<EmployeeType> {
  public getAllEmployees() {
    return this.getAll('/Employee');
  }

  public getEmployeeById(id: number) {
    return this.getOne('/Employee', id);
  }

  public getAllEmployeePages(page: number, pageSize: number) {
    return this.getAllPages('/Employee', page, pageSize);
  }

  public createEmployee(data: EmployeeType) {
    return this.create('/Employee', data);
  }

  public updateEmployee(id: number, data: Partial<EmployeeType>) {
    return this.update('/Employee', id, data);
  }

  public getEmployeesByProfession(professionIds: number | number[]) {
    const queryParam = Array.isArray(professionIds) ? professionIds.join(",") : professionIds;
    return this.getAll(`/Employee/by-professions?professionIds=${queryParam}`);
  }


  public deleteEmployee(id: number) {
    return this.delete('/Employee', id);
  }
}

const employeeService = new EmployeeService();
export default employeeService;
