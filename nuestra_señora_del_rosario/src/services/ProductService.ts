import Cookies from "js-cookie";
import { Product } from "../types/ProductType";
import ApiService from "./GenericService/ApiService";

class ProductService extends ApiService<Product> {
  constructor() {
    super();
  }

  // GET /api/Product (paginado)
  public getAllProducts(pageNumber: number, pageSize: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.getAllPagesWithHeaders("/Product", pageNumber, pageSize, {
      Authorization: `Bearer ${token}`,
    });
  }

  // GET /api/Product/{id}
  public getProductById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.getWithHeaders<Product>(`/Product/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // POST /api/Product
  public createProduct(product: Product) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.postWithHeaders<Product>("/Product", product, {
      Authorization: `Bearer ${token}`,
    });
  }

  // PATCH /api/Product/{id}
  public updateProduct(id: number, productPatch: Partial<Product>) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    return this.patchWithHeaders(`/Product/${id}`, productPatch, {
      Authorization: `Bearer ${token}`,
    });
  }

  // GET /api/Product/bycategory?categoryId=...&pageNumber=...&pageSize=...
  public getProductsByCategory(categoryId: number, pageNumber: number, pageSize: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    const url = `/Product/bycategory?categoryId=${categoryId}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.getAllPagesWithHeaders(url, pageNumber, pageSize, {
      Authorization: `Bearer ${token}`,
    });
  }

  // GET /api/Product/converted/{productId}?targetUnit=...
  public convertProductUnit(productId: number, targetUnit: string) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");
    const url = `/Product/converted/${productId}?targetUnit=${encodeURIComponent(targetUnit)}`;
    return this.getWithHeaders(url, {
      Authorization: `Bearer ${token}`,
    });
  }
}

const productService = new ProductService();
export default productService;
