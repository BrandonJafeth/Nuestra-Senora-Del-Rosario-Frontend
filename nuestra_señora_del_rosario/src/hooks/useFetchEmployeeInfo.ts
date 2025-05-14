// hooks/useFetchEmployeeInfo.ts
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchEmployeeInfo = async (cedula: string) => {
  const response = await axios.get(`https://apis.gometa.org/cedulas/${cedula}`);
  return response.data;
};

export const useFetchEmployeeInfo = (cedula: string | undefined) => {
  return useQuery({
    queryKey: ['EmployeeInfo', cedula],
    queryFn: () => fetchEmployeeInfo(cedula!),
    enabled: !!cedula && cedula.length === 9, // Valida que cedula no sea undefined primero
    retry: false,
  });
};
