import { useQuery } from 'react-query';
import specialtyService from '../services/SpecialityService';

export const useSpeciality = () => {
  return useQuery('speciality', () => specialtyService.getAllSpecialties());
};
