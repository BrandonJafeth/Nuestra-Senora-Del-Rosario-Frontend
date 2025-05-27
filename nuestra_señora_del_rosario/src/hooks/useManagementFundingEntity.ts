import { FundingEntityType } from "../types/FundingEntityType";
import { useCRUDGeneric } from "./GenericHook/CRUDGeneric";

export const useManagementFundingEntity = () => {
  return useCRUDGeneric<FundingEntityType>("/FundingEntity");
};
