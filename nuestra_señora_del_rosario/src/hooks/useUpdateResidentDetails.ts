// hooks/useUpdateResidentDetails.ts
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useToast } from './useToast'; // Para mostrar notificaciones
import residentsService from '../services/ResidentsService'; // residentsService correcto
import { ResidentPatchDto } from '../types/ResidentsType';

export const useUpdateResidentDetails = (residentId: number) => {
  const [idRoom, setIdRoom] = useState<number | ''>(''); // Para almacenar el ID de la habitación
  const [status, setStatus] = useState<string>('Activo'); // Estado (Activo o Inactivo)
  const [idDependencyLevel, setIdDependencyLevel] = useState<number | ''>(''); // Nivel de dependencia

  const queryClient = useQueryClient();
  const { showToast } = useToast(); // Para notificaciones de éxito o error

  // Mutación para realizar la actualización del residente
  const mutation = useMutation(
    async () => {
      // Solo enviamos los campos que tienen valores válidos (no vacíos)
      const dataToSend: Partial<ResidentPatchDto> = {};

      // Validar campos antes de enviarlos
      if (idRoom !== '') {
        dataToSend.id_Room = idRoom;
      }

      if (idDependencyLevel !== '') {
        dataToSend.id_DependencyLevel = idDependencyLevel;
      }

      if (status) {
        dataToSend.status = status;
      }

      // Imprimir datos a enviar para verificar
      console.log('Datos antes de enviar:', dataToSend);

      // Realizar la solicitud PATCH
      return residentsService.updateResidentStatus(residentId, dataToSend);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('residents');
        showToast('Residente actualizado exitosamente', 'success');
      },
      onError: (err) => {
        showToast('Error al actualizar residente', 'error');
        console.error('Error en la mutación:', err);
      },
    }
  );

  // Función para manejar el envío de los datos actualizados
  const handleSubmit = async () => {
    console.log('Datos antes de enviar:', { idRoom, status, idDependencyLevel });
    if (!idDependencyLevel && !status && !idRoom) {
      showToast('Por favor completa los campos a actualizar', 'error');
      return;
    }
    await mutation.mutateAsync(); // Ejecuta la mutación
  };

  return {
    idRoom,
    status,
    idDependencyLevel,
    setIdRoom, // Setter para ID de la habitación
    setStatus, // Setter para estado
    setIdDependencyLevel, // Setter para nivel de dependencia
    handleSubmit, // Función para enviar los datos
    isLoading: mutation.isLoading, // Estado de carga
    error: mutation.error, // Error en caso de fallo
  };
};