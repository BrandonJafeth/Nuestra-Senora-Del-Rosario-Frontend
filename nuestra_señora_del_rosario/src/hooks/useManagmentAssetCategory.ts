import { AssetsCategoryType } from "../types/AssetsCategoryType";
import { useCRUDGeneric } from "./GenericHook/CRUDGeneric";

export const useManagmentAssetCategory = () => {
  return useCRUDGeneric<AssetsCategoryType>("/AssetCategory");
};
