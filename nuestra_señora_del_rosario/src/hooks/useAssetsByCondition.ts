import { useQuery } from "react-query";
import { AxiosError } from "axios";
import assetService from "../services/AssetService";
import { AssetType } from "../types/AssetType";

type PagedResponse = {
  data: AssetType[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
};

/**
 * Hook para obtener activos filtrados por condición con paginación
 * @param condition Condición para filtrar (ej: "good", "bad", "regular")
 * @param pageNumber Número de página actual
 * @param pageSize Cantidad de elementos por página
 * @param options Opciones adicionales para useQuery
 */
export const useAssetsByCondition = (
  condition: string,
  pageNumber: number,
  pageSize: number,
  options = {}
) => {
  return useQuery<PagedResponse, AxiosError>(
    ["assetsByCondition", condition, pageNumber, pageSize],
    () => assetService.getAssetsByConditionPaged(condition, pageNumber, pageSize).then(response => response.data),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 minutos
      enabled: !!condition,
      ...options,
    }
  );
};

export default useAssetsByCondition;