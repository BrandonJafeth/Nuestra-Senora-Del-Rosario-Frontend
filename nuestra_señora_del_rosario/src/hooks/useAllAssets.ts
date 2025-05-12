// hooks/useAllAssets.ts
import { useQuery } from "react-query";
import assetService from "../services/AssetService";

export const useAllAssets = () => {
  return useQuery("allAssets", () => assetService.getAllAssetsUnpaged().then(res => res.data.data));
};
