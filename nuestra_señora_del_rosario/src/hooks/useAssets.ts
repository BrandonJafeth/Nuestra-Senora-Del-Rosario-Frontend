// hooks/useAssets.ts

import { useQuery } from "react-query";
import assetService from "../services/AssetService";
import { PagedAssetsResponse } from "../types/AssetType";

export const useAssets = (pageNumber: number, pageSize: number) => {
  return useQuery<PagedAssetsResponse, Error>(
    ["assets", pageNumber, pageSize],
    async () => {
      const response = await assetService.getAllAssetsPaged(pageNumber, pageSize);
      // Se asume que response.data tiene la estructura de PagedAssetsResponse:
      return response.data as unknown as PagedAssetsResponse;
    },
    {
      keepPreviousData: true,
      staleTime: 60000, 
    }
  );
};
