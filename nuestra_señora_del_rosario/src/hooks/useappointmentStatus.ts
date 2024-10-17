import { useQuery } from 'react-query';

import appointmentStatusService from '../services/AppointmentStatusService';

export const useAppointments = () => {
  return useQuery('appointmentsStatus', () => appointmentStatusService.getAllAppointmentsStatus());
};
