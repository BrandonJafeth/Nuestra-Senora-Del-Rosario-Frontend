// hooks/useFetchGuardianInfo.ts
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchGuardianInfo = async (cedula: string) => {
  const response = await axios.get(`https://apis.gometa.org/cedulas/${cedula}`);
  return response.data;
};

export const useFetchGuardianInfo = (cedula: string | undefined) => {
  return useQuery({
    queryKey: ['guardianInfo', cedula],
    queryFn: () => fetchGuardianInfo(cedula!),
    enabled: !!cedula && cedula.length === 9, // Valida que cedula no sea undefined primero
    retry: false,
  });
};
