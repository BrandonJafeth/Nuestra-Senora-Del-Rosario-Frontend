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

  public getProductsByCategory(categoryId: number, pageNumber: number, pageSize: number) {
    const url = `/Product/bycategory?categoryId=${categoryId}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.getAllPages(url, pageNumber, pageSize);
  }

  public convertProductUnit(productId: number, targetUnit: string) {
    const url = `/Product/converted/${productId}?targetUnit=${encodeURIComponent(targetUnit)}`;
    // Retorna una promesa de Axios, pero en .then() extraeremos la data con la forma ConvertProductResponse
    return this.getAll(url);
  }

  
}

const productService = new ProductService();
export default productService;
