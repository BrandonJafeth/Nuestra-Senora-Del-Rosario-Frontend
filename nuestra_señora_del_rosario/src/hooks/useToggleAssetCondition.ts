// hooks/useToggleAssetCondition.ts
import { useMutation, useQueryClient } from "react-query";
import assetService from "../services/AssetService";

export const useToggleAssetCondition = () => {
  const queryClient = useQueryClient();

  // Mutación para PATCH /Asset/{id}/toggle-condition
  const toggleConditionMutation = useMutation(
    async (id: number) => {
      // Llamamos al método del servicio
      return assetService.toggleAssetCondition(id);
    },
    {
      onSuccess: () => {
        // Invalida la query "assets" para recargar la lista y ver el cambio
        queryClient.invalidateQueries(["assets"]);
      },
      onError: (error) => {
        console.error("Error al cambiar la condición del activo:", error);
      },
    }
  );

  // Handler simplificado que puedes usar en tu componente
  const handleToggleCondition = (id: number) => {
    toggleConditionMutation.mutate(id);
  };

  return {
    handleToggleCondition,
    toggleConditionMutation, // opcional si quieres acceder a isLoading, isError, etc.
  };
};
