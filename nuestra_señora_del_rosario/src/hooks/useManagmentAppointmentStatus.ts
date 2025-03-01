import { useMutation, useQueryClient } from "react-query";
import appointmentStatusService from "../services/AppointmentStatusService";
import { AppointmentStatus } from "../types/AppointmentStatus";
import { useState } from "react";

export const useManagmentAppointmentStatus = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "warning" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 📌 Crear un estado de cita
  const createAppointmentStatus = useMutation(
    async (data: AppointmentStatus) => {
      return await appointmentStatusService.createAppointmentStatus(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("appointmentStatuses");
        showToast("✅ Estado de cita agregado correctamente!", "success");
      },
      onError: () => {
        showToast("❌ Error al agregar el estado de cita", "error");
      },
    }
  );

  // 📌 Eliminar un estado de cita
  const deleteAppointmentStatus = useMutation(
    async (id: string) => {
      return await appointmentStatusService.deleteAppointmentStatus(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("appointmentStatuses");
        showToast("✅ Estado de cita eliminado correctamente!", "success");
      },
      onError: (error) => {
        console.error("❌ Error al eliminar:", error);
        showToast("❌ No se puede eliminar el estado de cita porque está en uso", "error");
      },
    }
  );

  return { createAppointmentStatus, deleteAppointmentStatus, toast };
};
