import ApiService from './GenericService/ApiService';
import { CreateUserFromEmployeeRequest, CreateUserFromEmployeeResponse } from '../types/UserFromEmployeeType';
import Cookies from 'js-cookie';

class UserFromEmployeeService extends ApiService<CreateUserFromEmployeeRequest> {
  constructor() {
    super();
  }

  public createUserFromEmployee(data: CreateUserFromEmployeeRequest) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');

    // Convertir el objeto data en una cadena de consulta (query string)
    const queryParams = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');

    return this.postWithHeaders<CreateUserFromEmployeeResponse>(
      `/users/create-from-employee?${queryParams}`,
      null, // No se envía body, los datos se pasan en query params
      { Authorization: `Bearer ${token}` }
    );
  }
}

const createUserFromEmployeeService = new UserFromEmployeeService();
export default createUserFromEmployeeService;
