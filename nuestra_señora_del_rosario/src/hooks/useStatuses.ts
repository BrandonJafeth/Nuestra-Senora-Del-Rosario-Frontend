// FILE: hooks/useStatus.ts
import { useQuery } from 'react-query';
import statusService from '../services/StatusService';
import { StatusData } from '../types/StatusType';

export const useStatuses = () => {
  return useQuery<StatusData[], Error>('statuses', () => statusService.getAllStatus());
};