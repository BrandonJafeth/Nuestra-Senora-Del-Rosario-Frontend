// services/AssetCategoryService.ts
import { AssetsCategoryType } from '../types/AssetsCategoryType';
import ApiService from './GenericService/ApiService';


class AssetCategoryService extends ApiService<AssetsCategoryType> {
  constructor() {
    super(); // Usa la URL base desde el genérico
  }

  public getAllAssetCategorys() {
    return this.getAll('/AssetCategory');
  }

  public getAssetCategoryById(id: number) {
    return this.getOne('/AssetCategory', id); 
  }

  public createAssetCategory(data: AssetsCategoryType) {
    return this.create('/AssetCategory', data); 
  }

  public updateAssetCategory(id: number, data: Partial<AssetsCategoryType>) {
    return this.patch(`/AssetCategory/${id}`, id, data); // Cambia la ruta según tu API
  }

  public deleteAssetCategory(id: number) {
    return this.delete('/AssetCategory', id); // Cambia la ruta según tu API
  }
}

const assetCategoryService = new AssetCategoryService();
export default assetCategoryService;
