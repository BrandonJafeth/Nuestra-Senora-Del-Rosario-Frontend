import { useQuery } from "react-query";
import appointmentStatusService from "../services/AppointmentStatusService";
import { AppointmentStatus } from "../types/AppointmentStatus";

export const useAppointmentStatuses = () => {
  return useQuery<AppointmentStatus[], Error>(
    "/AppointmentStatus",
    async () => {
      const response = await appointmentStatusService.getAllAppointmentsStatus();

      if (!response.data || !Array.isArray(response.data)) {
        console.error("🚨 Error: Datos de estados de cita no válidos", response);
        return [];
      }

      return response.data.map((item) => ({
        id_StatusAP: item.id_StatusAP ?? 0,
        name_StatusAP: item.name_StatusAP || "Desconocido",
      }));
    },
    {
      staleTime: 5 * 60 * 1000, // Cache por 5 minutos
      cacheTime: 10 * 60 * 1000, // Almacenar en caché por 10 minutos
    }
  );
};
