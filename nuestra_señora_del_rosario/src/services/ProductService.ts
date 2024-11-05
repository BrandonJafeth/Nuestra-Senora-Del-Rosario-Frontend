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

  public createProduct(product: Product) {
    return this.create('/Product', product);
  }
}

const productService = new ProductService();
export default productService;
