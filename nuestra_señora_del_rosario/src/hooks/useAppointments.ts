import { useQuery } from 'react-query';
import appointmentService from '../services/AppointmentService';

export const useAppointments = () => {
  return useQuery('appointments', () => appointmentService.getAllAppointments());
};
