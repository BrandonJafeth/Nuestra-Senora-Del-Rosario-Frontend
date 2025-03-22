import { AssetType } from "../types/AssetType";
import ApiService from "./GenericService/ApiService";
import Cookies from "js-cookie";

class CreateAssetService extends ApiService<AssetType> {
  constructor() {
    super();
  }

  public createAsset(data: AssetType) {
    const token = Cookies.get("authToken");
    if (!token) throw new Error("No se encontró un token de autenticación");

    return this.postWithHeaders<AssetType>(`/Asset`, data, {
      Authorization: `Bearer ${token}`,
    });
  }
}

const createAssetService = new CreateAssetService();
export default createAssetService;