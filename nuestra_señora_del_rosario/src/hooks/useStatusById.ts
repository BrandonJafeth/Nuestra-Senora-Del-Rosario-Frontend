// FILE: hooks/useStatus.ts
import { useQuery } from 'react-query';
import statusService from '../services/StatusService';
import { StatusData } from '../types/StatusType';

export const useStatusById = (id: number) => {
  return useQuery<StatusData, Error>(['status', id], () => statusService.getStatusById(id));
};