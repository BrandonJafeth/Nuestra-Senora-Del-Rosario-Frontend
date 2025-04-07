// services/AssetService.ts

import Cookies from "js-cookie";
import { AssetType } from "../types/AssetType";
import ApiService from "./GenericService/ApiService";

class AssetService extends ApiService<AssetType> {
  constructor() {
    super();
  }

  // GET /api/Asset?paged?pageNumber=...&pageSize=...
  public getAllAssetsPaged(pageNumber: number, pageSize: number) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    // Envía Authorization: Bearer <token> con getWithHeaders
    return this.getWithHeaders<{
      data: AssetType[];
      totalRecords: number;
      pageNumber: number;
      pageSize: number;
    }>(`/Asset?paged?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
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

  // GET /api/Asset/byConditionPaged?condition=...&pageNumber=...&pageSize=...
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

  // GET /api/Asset/byCategoryPaged?categoryId=...&pageNumber=...&pageSize=...
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
}

const assetService = new AssetService();
export default assetService;
