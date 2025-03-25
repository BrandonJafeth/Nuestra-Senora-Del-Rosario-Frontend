// src/hooks/useUpdateAppointment.ts
import { useMutation, useQueryClient } from 'react-query';
import appointmentService from '../services/AppointmentService';
import { AppointmentUpdateDto } from '../types/AppointmentType';

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    // Mutación para actualizar una cita
    async ({ id, data }: { id: number; data: Partial<AppointmentUpdateDto> }) => {
      const response = await appointmentService.updateAppointment(id, data);

      // Verificar que la respuesta contenga la cita actualizada
      if (!response || !response.data) {
        throw new Error('Respuesta inválida del servidor');
      }

      return response.data; // Devolver los datos para actualizar el cache
    },
    {
      // Actualizar cache en caso de éxito
      onSuccess: (updatedAppointment) => {
        console.log('Cita actualizada con éxito:', updatedAppointment);

        // Actualiza el cache de la cita específica para evitar invalidar toda la lista
        queryClient.setQueryData(
          ['appointments', updatedAppointment.id_Appointment], 
          updatedAppointment
        );

        // Refresca la lista de citas solo si es necesario
        queryClient.invalidateQueries('appointments', { refetchInactive: true });
      },

      // Manejo de errores
      onError: (error) => {
        console.error('Error al actualizar la cita:', error);
        
      },

      // Comportamiento cuando la mutación se completa, sin importar el resultado
      onSettled: () => {
        queryClient.invalidateQueries('appointments'); // Refrescar siempre al finalizar
      },

      // Reintento en caso de errores transitorios (como pérdida de conexión)
      retry: 1, // Intentar nuevamente una vez si falla
    }
  );
};