// hooks/useUpdateResidentDetails.ts
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useToast } from './useToast'; // Para mostrar notificaciones
import residentsService from '../services/ResidentsService'; // residentsService correcto

export const useUpdateResidentDetails = (residentId: number) => {
  const [idRoom, setIdRoom] = useState<number | ''>(''); // Para almacenar el ID de la habitación
  const [status, setStatus] = useState<string>('Activo'); // Estado (Activo o Inactivo)
  const [idDependencyLevel, setIdDependencyLevel] = useState<number | ''>(''); // Nivel de dependencia

  const queryClient = useQueryClient();
  const { showToast } = useToast(); // Para notificaciones de éxito o error

  // Mutación para realizar la actualización del residente
  const mutation = useMutation(
    async () => {
      return residentsService.updateResidentStatus(residentId, {
        id_Room: idRoom || 0, // Si no hay ID de habitación, enviar 0
        id_DependencyLevel: idDependencyLevel || 0, // Si no hay nivel de dependencia, enviar 0
        status, // El estado actual del residente (Activo o Inactivo)
        fechaNacimiento: '', // No se modifica la fecha de nacimiento
      });
    },
    {
      onSuccess: () => {
        // Invalida la consulta para refrescar los residentes después de la actualización
        queryClient.invalidateQueries('residents');
        showToast('Residente actualizado exitosamente', 'success');
      },
      onError: () => {
        showToast('Error al actualizar residente', 'error');
      },
    }
  );

  // Función para manejar el envío de los datos actualizados
  const handleSubmit = () => {
    if (!idRoom || !idDependencyLevel || !status) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }
    mutation.mutate(); // Ejecuta la mutación
  };

  return {
    idRoom,
    status,
    idDependencyLevel,
    setIdRoom, // Setter para ID de la habitación
    setStatus, // Setter para estado
    setIdDependencyLevel, // Setter para nivel de dependencia
    handleSubmit, // Función para enviar los datos
    isLoading: mutation.isLoading, // Estado de carga de la mutación
    error: mutation.error, // Error en caso de fallo
  };
};