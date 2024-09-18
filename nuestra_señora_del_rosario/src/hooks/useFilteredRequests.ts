import { VolunteerRequest } from '../types/VolunteerType';

export const useFilteredRequests = (
  volunteerRequests: VolunteerRequest[],
  filterStatus: string,
  filterType: string
) => {
  return volunteerRequests.filter((request) => {
    if (filterStatus !== 'Todas' && request.status_Name !== filterStatus) return false;
    if (filterType !== 'Todas' && request.name_voluntarieType !== filterType) return false;
    return true;
  });
};
