import { useState } from 'react';
import { VolunteerRequest } from '../types/VolunteerType';

export const useEditVolunteerStatus = (volunteerRequests: VolunteerRequest[]) => {
  const [requests, setRequests] = useState<VolunteerRequest[]>(volunteerRequests);

  // Función para actualizar el estado de un voluntario
  const updateStatus = (volunteerId: number, newStatus: "Aceptada" | "Rechazada" | "Pendiente") => {
    const updatedRequests = requests.map((request) =>
      request.id_FormVoluntarie === volunteerId ? { ...request, status: newStatus } : request
    );
    setRequests(updatedRequests);
  };

  return {
    requests,
    updateStatus,
  };
};
