// services/ProductService.ts
import { Product } from '../types/ProductType';
import ApiService from './GenericService/ApiService';

class ProductService extends ApiService<Product> {
  constructor() {
    super();
  }

 // En ProductService.ts
public getAllProducts(pageNumber: number, pageSize: number) {
  return this.getAllPages('/Product', pageNumber, pageSize);
}

  getProductById(id: number) {
    return this.getOne('/Product', id);
  }

  public createProduct(product: Product) {
    return this.create('/Product', product);
  }

  public updateProduct(id: number, productPatch: Partial<Product>) {
    return this.patch('/Product', id, productPatch);
  }
}

const productService = new ProductService();
export default productService;
