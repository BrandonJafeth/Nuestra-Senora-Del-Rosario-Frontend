// src/hooks/useEmployeesWithoutUser.ts

import Cookies from 'js-cookie'
import { UserData } from '../types/UserType'
import userService from '../services/UserService'
import { useQuery } from 'react-query'

/**
 * Hook para obtener la lista de empleados que aún no tienen usuario.
 * Usa React Query para el fetching, caché y reintentos automáticos.
 */
export function useEmployeesWithoutUser() {
  return useQuery<UserData[], Error>({
    queryKey: ['employeesWithoutUser'],
    queryFn: async () => {
      const token = Cookies.get('authToken')
      if (!token) {
        throw new Error('No se encontró un token de autenticación')
      }
      const response = await userService.employeeswithoutUser()
      return response.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutos en caché
    retry: 2,                  // reintentar hasta 2 veces ante fallo
    refetchOnWindowFocus: false,
  })
}
