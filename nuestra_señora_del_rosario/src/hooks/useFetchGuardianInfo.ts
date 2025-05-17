// hooks/useFetchGuardianInfo.ts
import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';

export interface MetaPerson {
  firstname: string
  lastname1: string
  lastname2: string
}

export interface FetchGuardianInfoResponse {
  results: MetaPerson[]
}

const fetchGuardianInfo = async (cedula: string): Promise<FetchGuardianInfoResponse> => {
  const response = await axios.get<FetchGuardianInfoResponse>(`https://apis.gometa.org/cedulas/${cedula}`)
  return response.data
}

export const useFetchGuardianInfo = (
  cedula: string | undefined,
  options?: UseQueryOptions<FetchGuardianInfoResponse>
) => {
  return useQuery<FetchGuardianInfoResponse>({
    queryKey: ['guardianInfo', cedula],
    queryFn: () => fetchGuardianInfo(cedula!),
    enabled: !!cedula && cedula.length === 9,
    retry: false,
   keepPreviousData: false,          // <<< no mantener datos antiguos
    ...options
  })
}