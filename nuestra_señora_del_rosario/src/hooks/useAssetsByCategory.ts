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
 * Hook para obtener activos filtrados por categoría con paginación
 * @param categoryId ID de la categoría para filtrar
 * @param pageNumber Número de página actual
 * @param pageSize Cantidad de elementos por página
 * @param options Opciones adicionales para useQuery
 */
export const useAssetsByCategory = (
  categoryId: number | undefined,
  pageNumber: number,
  pageSize: number,
  options = {}
) => {
  return useQuery<PagedResponse, AxiosError>(
    ["assetsByCategory", categoryId, pageNumber, pageSize],
    () => assetService.getAssetsByCategoryPaged(categoryId as number, pageNumber, pageSize).then(response => response.data),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, 
      enabled: !!categoryId,
      ...options,
    }
  );
};

export default useAssetsByCategory;