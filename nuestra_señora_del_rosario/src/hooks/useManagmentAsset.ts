// hooks/useManageAsset.ts
import { useMutation, useQueryClient } from "react-query";
import assetService from "../services/AssetService";
import { AssetType } from "../types/AssetType";

interface UpdatePayload {
  id: number;
  data: Partial<AssetType>;
}

export const useManageAsset = () => {
  const queryClient = useQueryClient();

  // Mutación para actualizar un activo
  const updateAssetMutation = useMutation(
    async ({ id, data }: UpdatePayload) => {
      // Llamamos a la función del servicio que hace PUT /Asset/{id}
      return assetService.updateAsset(id, data);
    },
    {
      onSuccess: () => {
        // Invalida o refetch de la lista de activos para ver cambios
        queryClient.invalidateQueries(["assets"]);
      },
      onError: (error: unknown) => {
        console.error("Error al actualizar el activo:", error);
      },
    }
  );

  // Handler que puedes usar directamente en el componente
  const handleUpdateAsset = (id: number, data: Partial<AssetType>) => {
    updateAssetMutation.mutate({ id, data });
  };

  return {
    updateAssetMutation,  // Exponemos la mutación si se quiere un control más granular
    handleUpdateAsset,    // Función simplificada para actualizar
  };
};
