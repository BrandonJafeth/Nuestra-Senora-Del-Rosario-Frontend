import Cookies from "js-cookie";
import { Category } from "../types/CategoryType";
import ApiService from "./GenericService/ApiService";

class CategoryService extends ApiService<Category> {
  constructor() {
    super();
  }

  public getAllCategories() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<Category[]>("/Category", {
      Authorization: `Bearer ${token}`,
    });
  }
}

export default new CategoryService();
