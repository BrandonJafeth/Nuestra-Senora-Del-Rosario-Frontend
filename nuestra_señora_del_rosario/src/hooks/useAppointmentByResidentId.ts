// src/hooks/useAppointments.ts

import { useQuery } from 'react-query';
import appointmentService from '../services/AppointmentService';

export const useAppointmentsByResident = (residentId: number) => {
  return useQuery({
    queryKey: ['appointments', residentId],
    queryFn: () => appointmentService.getAppointmentsByResident(residentId),
    enabled: !!residentId, // Solo ejecuta la query si existe un residentId
    staleTime: 1000 * 60 * 5, // 5 minutos antes de considerar los datos obsoletos
  });
};