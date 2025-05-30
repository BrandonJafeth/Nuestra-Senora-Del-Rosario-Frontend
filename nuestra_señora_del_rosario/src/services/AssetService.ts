// services/AssetService.ts

import Cookies from "js-cookie";
import { AssetType } from "../types/AssetType";
import ApiService from "./GenericService/ApiService";

// Interfaz para el filtro de activos
export interface AssetFilterDTO {
  assetName?: string | null;
}

// Interfaz para la respuesta paginada de filtrado
export interface FilterAssetsResponse {
  Data: AssetType[];
  TotalRecords: number;
  PageNumber: number;
  PageSize: number;
}

class AssetService extends ApiService<AssetType> {
  constructor() {
    super();
  }

  // GET /api/Asset/paged?pageNumber=...&pageSize=...
  public getAllAssetsPaged(pageNumber: number, pageSize: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // Envía Authorization: Bearer <token> con getWithHeaders
    return this.getWithHeaders<{
      data: AssetType[];
      totalRecords: number;
      pageNumber: number;
      pageSize: number;
    }>(`/Asset/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // GET /api/Asset/{id}
  public getAssetById(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<AssetType>(`/Asset/${id}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // POST /api/Asset
  public createAsset(data: AssetType) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.postWithHeaders<AssetType>(`/Asset`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // PUT /api/Asset/{id}
  public updateAsset(id: number, data: Partial<AssetType>) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.updateWithHeaders(`/Asset/${id}`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // DELETE /api/Asset/{id}
  public deleteAsset(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.deleteWithHeaders<null>(`/Asset`, id.toString(), {
      Authorization: `Bearer ${token}`,
    });
  }

  // PATCH /api/Asset/{id}/toggle-condition
  public toggleAssetCondition(id: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // Envía un patch con payload vacío o con la data que requiera tu API
    return this.patchWithHeaders(`/Asset/${id}/toggle-condition`, {}, {
      Authorization: `Bearer ${token}`,
    });
  }

  public getAssetsByConditionPaged(condition: string, pageNumber: number, pageSize: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<{
      data: AssetType[];
      totalRecords: number;
      pageNumber: number;
      pageSize: number;
    }>(`/Asset/byConditionPaged?condition=${encodeURIComponent(condition)}&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  public getAssetsByCategoryPaged(categoryId: number, pageNumber: number, pageSize: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<{
      data: AssetType[];
      totalRecords: number;
      pageNumber: number;
      pageSize: number;
    }>(`/Asset/byCategoryPaged?categoryId=${categoryId}&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  // GET /api/Asset/filter
  public filterAssets(
    filter: AssetFilterDTO,
    pageNumber: number = 1,
    pageSize: number = 10
  ) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // Construir query params
    const params = new URLSearchParams();
    if (filter.assetName) params.append("assetName", filter.assetName);
    params.append("pageNumber", pageNumber.toString());
    params.append("pageSize", pageSize.toString());

    return this.getWithHeaders<FilterAssetsResponse>(`/Asset/filter?${params.toString()}`, {
      Authorization: `Bearer ${token}`,
    });
  }

  public getAllAssetsUnpaged() {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.getWithHeaders<{
      data: AssetType[];
      totalRecords: number;
      pageNumber: number;
      pageSize: number;
    }>(`/Asset/paged?pageNumber=1&pageSize=10000`, {
      Authorization: `Bearer ${token}`,
    });  }  
  public checkPlateExists(plate: string) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");   
    return this.getWithHeaders<boolean | { exists: boolean }>(`/Asset/verify-plate?plate=${encodeURIComponent(plate)}`, {
      Authorization: `Bearer ${token}`,
    });
  }
}

const assetService = new AssetService();
export default assetService;
