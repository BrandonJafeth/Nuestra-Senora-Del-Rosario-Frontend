import { useMutation, useQueryClient } from "react-query";
import healthcareCenterService from "../services/HealthcareCenterService";
import { HealthcareCenter } from "../types/HealthcareCenter";
import { useState } from "react";

export const useManagmentHealtcareCenter = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "warning" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 📌 Crear un centro de atención
  const createHealthcareCenter = useMutation(
    async (data: HealthcareCenter) => {
      return await healthcareCenterService.createHealthcareCenter(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("healthcareCenters");
        showToast("✅ Centro de atención agregado correctamente!", "success");
      },
      onError: () => {
        showToast("❌ Error al agregar el centro de atención", "error");
      },
    }
  );

  // 📌 Eliminar un centro de atención
  const deleteHealthcareCenter = useMutation(
    async (id: number) => {
      return healthcareCenterService.deleteHealthcareCenter(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("healthcareCenters");
        showToast("✅ Centro de atención eliminado correctamente!", "success");
      },
      onError: (error) => {
        console.error("Error al eliminar:", error);
        showToast("❌ No se puede eliminar el centro de atención porque está en uso", "error");
      },
    }
  );

  return {  createHealthcareCenter, deleteHealthcareCenter, toast };
};
