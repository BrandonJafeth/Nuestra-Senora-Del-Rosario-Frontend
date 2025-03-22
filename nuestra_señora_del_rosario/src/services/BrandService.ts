// services/BrandService.ts
import Cookies from "js-cookie";
import { BrandType } from "../types/BrandType";
import ApiService from "./GenericService/ApiService";

/** 
 * La API de BrandController requiere el rol "Admin" 
 * y el token en la cabecera Authorization: Bearer <token>.
 */
class BrandService extends ApiService<BrandType> {
  // Obtiene todas las marcas con paginación
  public getAllBrands(pageNumber: number, pageSize: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // GET /api/brand?pageNumber=...&pageSize=...
    // El backend retorna algo como:
    // {
    //   Data: BrandReadDto[],
    //   TotalRecords: number,
    //   PageNumber: number,
    //   PageSize: number,
    //   TotalPages: number
    // }
    return this.getWithHeaders<{
      Data: BrandType[];
      TotalRecords: number;
      PageNumber: number;
      PageSize: number;
      TotalPages: number;
    }>(`/Brand?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Obtiene una marca por ID: GET /api/brand/{id}
  public getBrandById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<BrandType>(`/Brand/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Crea una marca: POST /api/brand
  public async createBrand(data: Omit<BrandType, "idBrand">) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // postWithHeaders -> enviamos el token en headers
    const response = await this.postWithHeaders<BrandType>("/Brand", data, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  }

  // Actualiza una marca: PUT /api/brand/{id}
  public async updateBrand(id: number, data: Partial<BrandType>) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // updateWithHeaders -> asume que es un PUT (ver ApiService)
    const response = await this.updateWithHeaders(`/Brand/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  }

  // Elimina una marca: DELETE /api/brand/{id}
  public async deleteBrand(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // deleteWithHeaders
    const response = await this.deleteWithHeaders<null>("/Brand", id.toString(), {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  }
}

const brandService = new BrandService();
export default brandService;
