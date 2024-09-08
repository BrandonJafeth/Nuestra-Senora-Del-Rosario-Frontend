import ApiService from './GenericService/ApiService';
import { EmployeeType } from '../types/EmployeeType';

const employeeService = new ApiService<EmployeeType>();

employeeService.getAll('/employees');
employeeService.getOne('/employees', 1);

export default employeeService;
