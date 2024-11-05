// FILE: hooks/useUnitsOfMeasure.ts
import { useQuery } from 'react-query';
import UnitOfMeasureService from '../services/UnitOfMeasureService';
import { UnitOfMeasure } from '../types/UnitOfMeasureType';

export const useUnitsOfMeasure = () => {
  return useQuery<UnitOfMeasure[], Error>('unitsOfMeasure', () => UnitOfMeasureService.getAllUnits().then((res) => res.data), {
    staleTime: 5 * 60 * 1000, 
    cacheTime: 10 * 60 * 1000,
  });
};
