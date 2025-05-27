import { useQuery } from "react-query";
import fundingEntityService from "../services/FundingEntityService";
import { FundingEntityType } from "../types/FundingEntityType";

export const useFundingEntity = () => {
  return useQuery<FundingEntityType[], Error>(
    "FundingEntity",
    async () => {
      const response = await fundingEntityService.getAllFundingEntities();
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );
};
