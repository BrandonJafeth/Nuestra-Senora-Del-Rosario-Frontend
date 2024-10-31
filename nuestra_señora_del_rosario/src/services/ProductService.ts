// services/ProductService.ts
import { Product } from '../types/ProductType';
import ApiService from './GenericService/ApiService';

class ProductService extends ApiService<Product> {
  constructor() {
    super();
  }

  public getAllProducts() {
    return this.getAll('/Product');
  }
}

const productService = new ProductService();
export default productService;
