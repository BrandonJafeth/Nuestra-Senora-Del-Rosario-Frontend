import { UserData } from '../types/UserType';
import ApiService from './GenericService/ApiService';
import Cookies from 'js-cookie';

class UserService extends ApiService<UserData> {

  // Método para crear un nuevo usuario (sin token)
  public createUser(data: UserData) {
    return this.create('/users/login', data);
  }

  // Método para filtrar usuarios por nombre, apellidos y cédula
  public filterUsers(
    nombre?: string, 
    apellido1?: string, 
    apellido2?: string, 
    cedula?: string, 
    pageNumber: number = 1, 
    pageSize: number = 10
  ) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    
    // Construir la URL con los parámetros de consulta
    let url = '/users/filter?';
    if (nombre) url += `nombre=${encodeURIComponent(nombre)}&`;
    if (apellido1) url += `apellido1=${encodeURIComponent(apellido1)}&`;
    if (apellido2) url += `apellido2=${encodeURIComponent(apellido2)}&`;
    if (cedula) url += `cedula=${encodeURIComponent(cedula)}&`;
    url += `pageNumber=${pageNumber}&pageSize=${pageSize}`;
    
    console.log('URL de filtrado de usuarios:', url);
    console.log('Token utilizado (primeros caracteres):', token.substring(0, 15) + '...');
    
    try {
      // Intentar usar la búsqueda paginada
      return this.getWithHeaders<{users: UserData[], totalPages: number}>(url, {
        Authorization: `Bearer ${token}`,
      });
    } catch (error) {
      console.error('Error al llamar al endpoint de filtrado de usuarios:', error);
      throw error;
    }
  }

  // Método para asignar rol a empleado, enviando el token en la cabecera
  public assignRoleToEmployee(dniEmployee: number, idRole: number) {
    const token = Cookies.get('authToken');
    if (!token) throw new Error('No se encontró un token de autenticación');
    return this.postWithHeaders(
      `/users/create-from-employee/${dniEmployee}/${idRole}`,
      { dniEmployee, password: '' },
      { Authorization: `Bearer ${token}` }
    );
  }
}

const userService = new UserService();
export default userService;
