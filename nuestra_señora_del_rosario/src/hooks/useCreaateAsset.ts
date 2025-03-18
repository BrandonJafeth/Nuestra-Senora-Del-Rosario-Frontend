import { useMutation } from "react-query";
import createAssetService from "../services/CreateAssetService";
import { AssetType } from "../types/AssetType";

export const useCreateAsset = () => {
  return useMutation((newAsset: AssetType) => createAssetService.createAsset(newAsset));
};