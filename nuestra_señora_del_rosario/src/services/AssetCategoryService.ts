// services/AssetCategoryService.ts
import Cookies from "js-cookie";
import { AssetsCategoryType } from "../types/AssetsCategoryType";
import ApiService from "./GenericService/ApiService";

class AssetCategoryService extends ApiService<AssetsCategoryType> {
  constructor() {
    super();
  }

  // GET /api/AssetCategory
  public getAllAssetCategorys() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<AssetsCategoryType[]>("/AssetCategory", {
      Authorization: `Bearer ${token}`,
    });
  }

  // GET /api/AssetCategory/{id}
  public getAssetCategoryById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<AssetsCategoryType>(`/AssetCategory/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // POST /api/AssetCategory
  public createAssetCategory(data: AssetsCategoryType) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.postWithHeaders<AssetsCategoryType>("/AssetCategory", data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // PATCH /api/AssetCategory/{id} (o PUT, según tu backend)
  public updateAssetCategory(id: number, data: Partial<AssetsCategoryType>) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.updateWithHeaders(`/AssetCategory/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // DELETE /api/AssetCategory/{id}
  public deleteAssetCategory(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.deleteWithHeaders<null>("/AssetCategory", id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }
}

const assetCategoryService = new AssetCategoryService();
export default assetCategoryService;
