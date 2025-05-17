// hooks/useFetchGuardianInfo.ts
import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';

// src/types/FetchResidentInfo.ts
export interface MetaPerson {
  firstname: string
  lastname1: string
  lastname2: string
  // añade aquí cualquier otro campo que te retorne la API
}

export interface FetchResidentInfoResponse {
  results: MetaPerson[]
}

const fetchResidentInfo = async (cedula: string): Promise<FetchResidentInfoResponse> => {
  const { data } = await axios.get<FetchResidentInfoResponse>(
    `https://apis.gometa.org/cedulas/${cedula}`
  )
  return data
}

export const useFetchResidentInfo = (
  cedula: string | undefined,
  options?: UseQueryOptions<FetchResidentInfoResponse>
) => {
  return useQuery<FetchResidentInfoResponse>({
    queryKey: ['residentInfo', cedula],
    queryFn: () => fetchResidentInfo(cedula!),
    enabled: !!cedula && cedula.length === 9,
    retry: false,
    keepPreviousData: false,
    ...options,
  })
}