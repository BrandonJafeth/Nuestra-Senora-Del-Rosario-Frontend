// services/AssetService.ts

import { AssetType } from "../types/AssetType";
import ApiService from "./GenericService/ApiService";

class AssetService extends ApiService<AssetType> {
  constructor() {
    super();
  }


  public getAllAssetsPaged(pageNumber: number, pageSize: number) {
    return this.getAll(
      `/Asset?paged?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  public getAssetById(id: number) {
    return this.getOne(`/Asset`, id);
  }

  public createAsset(data: AssetType) {
    return this.create(`/Asset`, data);
  }

  public updateAsset(id: number, data: Partial<AssetType>) {
    // Ajusta la ruta según tu API (ej. /Asset/{id})
    return this.putWithoutId(`/Asset/${id}`, data);
  }

  public deleteAsset(id: number) {
    return this.delete(`/Asset`, id);
  }

  public toggleAssetCondition(id: number) {
    // Llamamos a patch pasando la ruta y el id, el payload puede ser un objeto vacío
    return this.patchWithoutId(`/Asset/${id}/toggle-condition`, {});
  }
}

const assetService = new AssetService();
export default assetService;
