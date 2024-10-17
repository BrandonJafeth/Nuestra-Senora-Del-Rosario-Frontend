// hooks/useAppointments.js
import { useQuery } from 'react-query';
import { getAppointments } from '../services/AppointmentService';

// Hook personalizado para obtener citas médicas
export const useAppointments = () => {
  return useQuery('appointments', getAppointments, {
    staleTime: 5 * 60 * 1000, // Cachear durante 5 minutos
    refetchOnWindowFocus: false, // No refetch en foco de ventana
  });
};
