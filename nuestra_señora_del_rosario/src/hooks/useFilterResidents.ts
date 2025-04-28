// hooks/useFilterResidents.ts
import { useState } from 'react';
import residentsService from '../services/ResidentsService';
import { ResidentFilter, ResidentFilterResponse } from '../types/ResidentFilterType';
import { AxiosError } from 'axios';

interface UseFilterResidentsResult {
  filteredResidents: ResidentFilterResponse | null;
  loading: boolean;
  error: string | null;
  filterResidents: (filters: ResidentFilter) => Promise<void>;
}

const useFilterResidents = (): UseFilterResidentsResult => {
  const [filteredResidents, setFilteredResidents] = useState<ResidentFilterResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const filterResidents = async (filters: ResidentFilter): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await residentsService.filterResidents(
        filters.nombre,
        filters.apellido1,
        filters.apellido2,
        filters.cedula,
        filters.pageNumber || 1,
        filters.pageSize || 10
      );

      setFilteredResidents(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        (axiosError.response?.data as { error?: string })?.error || 
        axiosError.message || 
        'Error al filtrar residentes'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    filteredResidents,
    loading,
    error,
    filterResidents
  };
};

export default useFilterResidents;