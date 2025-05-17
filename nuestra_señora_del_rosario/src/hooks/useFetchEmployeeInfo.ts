// src/hooks/useFetchEmployeeInfo.ts
import axios from 'axios'
import { useQuery, UseQueryOptions } from 'react-query'

// src/types/FetchEmployeeInfo.ts
export interface MetaPerson {
  firstname: string
  lastname1: string
  lastname2: string
  // cualquier otro campo que venga
}

export interface FetchEmployeeInfoResponse {
  results: MetaPerson[]
}


const fetchEmployeeInfo = async (cedula: string): Promise<FetchEmployeeInfoResponse> => {
  const response = await axios.get<FetchEmployeeInfoResponse>(`https://apis.gometa.org/cedulas/${cedula}`)
  return response.data
}

export const useFetchEmployeeInfo = (
  cedula: string | undefined,
  options?: UseQueryOptions<FetchEmployeeInfoResponse>
) => {
  return useQuery<FetchEmployeeInfoResponse>({
    queryKey: ['EmployeeInfo', cedula],
    queryFn: () => fetchEmployeeInfo(cedula!),
    enabled: !!cedula && cedula.length === 9,
    retry: false,
    ...options
  })
}