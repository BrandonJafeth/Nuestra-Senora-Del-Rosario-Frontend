import ApiService from './GenericService/ApiService';
import { EmployeeType } from '../types/EmployeeType';

class EmployeeService extends ApiService<EmployeeType> {
  public getAllEmployees() {
    return this.getAll('/Employee');
  }

  public getEmployeeById(id: number) {
    return this.getOne('/Employee', id);
  }

  public createEmployee(data: EmployeeType) {
    return this.create('/Employee', data);
  }

  public updateEmployee(id: number, data: Partial<EmployeeType>) {
    return this.update('/Employee', id, data);
  }

  public deleteEmployee(id: number) {
    return this.delete('/Employee', id);
  }
}

const employeeService = new EmployeeService();
export default employeeService;
