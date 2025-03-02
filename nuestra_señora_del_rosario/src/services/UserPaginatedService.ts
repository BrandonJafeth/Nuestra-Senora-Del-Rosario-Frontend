import { UserResponsePages } from '../types/UserType';
import ApiService from './GenericService/ApiService';
import { AxiosResponse } from 'axios';

class UserPaginatedService extends ApiService<UserResponsePages> {
  public async getPaginatedUsers(pageNumber: number, pageSize: number): Promise<AxiosResponse<UserResponsePages>> {
    return this.getAllPages('/users/paginated', pageNumber, pageSize);
  }
}

const userPaginatedService = new UserPaginatedService();
export default userPaginatedService;
