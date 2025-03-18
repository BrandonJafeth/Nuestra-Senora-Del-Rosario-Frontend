import { AssetType } from "../types/AssetType";
import ApiService from "./GenericService/ApiService";

class CreateAssetService extends ApiService<AssetType> {
  constructor() {
    super();
  }

  public createAsset(data: AssetType) {
    return this.create("/Asset", data);
  }
}

const createAssetService = new CreateAssetService();
export default createAssetService;