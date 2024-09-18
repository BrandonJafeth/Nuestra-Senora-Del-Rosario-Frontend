import { VolunteerRequest } from '../types/VolunteerType';

export const useFilteredRequests = (
  volunteerRequests: VolunteerRequest[] = [], // Inicializar como array vacío
  filterStatus: 'Aceptada' | 'Rechazada' | 'Pendiente' | 'Todas',
  filterType: string
) => {
  if (volunteerRequests.length === 0) {
    return [];
  }

  return volunteerRequests.filter((request) => {
    const matchesStatus = filterStatus === 'Todas' || request.status_Name === filterStatus;
    const matchesType = filterType === 'Todas' || request.name_voluntarieType === filterType;
    return matchesStatus && matchesType;
  });
};
