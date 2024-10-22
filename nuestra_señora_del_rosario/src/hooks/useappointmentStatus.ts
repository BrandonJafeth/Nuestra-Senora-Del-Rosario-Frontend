// src/hooks/useAppointmentStatuses.ts
import { useQuery } from 'react-query';
import appointmentStatusService from '../services/AppointmentStatusService';

// Hook para obtener los estados de las citas
export const useAppointmentStatuses = () => {
  return useQuery('appointmentStatuses', () =>
    appointmentStatusService.getAllAppointmentsStatus()
  );
};
