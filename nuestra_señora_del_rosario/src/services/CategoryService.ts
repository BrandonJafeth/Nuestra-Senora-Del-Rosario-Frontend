import { Category } from '../types/CategoryType';
import ApiService from './GenericService/ApiService';

class CategoryService extends ApiService<Category> {
  constructor() {
    super();
  }

  getAllCategories() {
    return this.getAll('/Category');
  }
}

export default new CategoryService();
