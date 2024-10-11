// hooks/useResidentCreate.ts
import { useMutation } from 'react-query';
import residentCreateService from '../services/ResidentCreateService';
import residentsService from '../services/ResidentsService'; // Importar el servicio correcto
import { ResidentPostType } from '../types/ResidentsType';
import { useToast } from './useToast'; // Para mostrar mensajes Toast

// Hook para crear un nuevo residente
export const useCreateResident = () => {
  const { showToast } = useToast();

  return useMutation(
    (residentData: ResidentPostType) => residentCreateService.createResident(residentData),
    {
      onSuccess: () => {
        showToast('Residente creado exitosamente', 'success');
      },
      onError: () => {
        showToast('Error al crear el residente', 'error');
      },
    }
  );
};

// Hook para crear un residente desde una solicitud aprobada
export const useCreateResidentFromApplicant = () => {
  const { showToast } = useToast();

  return useMutation(
    (applicantData: any) => residentsService.createResidentFromApplicant(applicantData), 
    {
      onSuccess: () => {
        showToast('Residente creado desde la solicitud exitosamente', 'success');
      },
      onError: () => {
        showToast('Error al crear el residente desde la solicitud', 'error');
      },
    }
  );
};
