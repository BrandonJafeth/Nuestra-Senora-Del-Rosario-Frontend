// hooks/useFilterUsers.ts
import { useState, useCallback } from 'react';
import userService from '../services/UserService';
import { UserFilter, UserFilterResponse } from '../types/UserFilterType';
import { AxiosError } from 'axios';

// Enum para los tipos de filtro que podemos usar
export enum FilterUserType {
  NONE = "none",
  NAME = "nombre",
  LASTNAME1 = "apellido1",
  LASTNAME2 = "apellido2",
  DNI = "cedula"
}

interface UseFilterUsersResult {
  filteredUsers: UserFilterResponse | null;
  loading: boolean;
  error: string | null;
  filterUsers: (filters: UserFilter) => Promise<void>;
  forceUpdate: () => void; 
  // Nuevos campos para manejar el tipo de filtro
  filterType: FilterUserType;
  setFilterType: (type: FilterUserType) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  applyFilter: () => Promise<void>;
  clearFilter: () => void;
}

const useFilterUsers = (): UseFilterUsersResult => {
  const [filteredUsers, setFilteredUsers] = useState<UserFilterResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [updateCounter, setUpdateCounter] = useState<number>(0);
  
  // Nuevos estados para manejar el tipo de filtro y el término de búsqueda
  const [filterType, setFilterType] = useState<FilterUserType>(FilterUserType.NONE);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentFilters, setCurrentFilters] = useState<UserFilter>({
    pageNumber: 1,
    pageSize: 10
  });

  // Función para forzar actualización
  const forceUpdate = useCallback(() => {
    setUpdateCounter(prev => prev + 1);
  }, []);

  // Función para aplicar el filtro basado en el tipo de filtro y término de búsqueda
  const applyFilter = useCallback(async () => {
    if (filterType === FilterUserType.NONE || !searchTerm.trim()) {
      // Si no hay filtro o término de búsqueda, no hacemos nada
      return;
    }

    const newFilters: UserFilter = {
      ...currentFilters,
      pageNumber: 1 // Siempre volver a la primera página al filtrar
    };

    // Asignar el término de búsqueda al campo correcto según el tipo de filtro
    switch (filterType) {
      case FilterUserType.NAME:
        newFilters.nombre = searchTerm;
        break;
      case FilterUserType.LASTNAME1:
        newFilters.apellido1 = searchTerm;
        break;
      case FilterUserType.LASTNAME2:
        newFilters.apellido2 = searchTerm;
        break;
      case FilterUserType.DNI:
        newFilters.cedula = searchTerm;
        break;
      default:
        break;
    }

    setCurrentFilters(newFilters);
    await filterUsers(newFilters);
  }, [filterType, searchTerm, currentFilters]);

  // Función para limpiar el filtro y restablecer los datos
  const clearFilter = useCallback(() => {
    setFilterType(FilterUserType.NONE);
    setSearchTerm('');
    setCurrentFilters({
      pageNumber: 1,
      pageSize: currentFilters.pageSize
    });
    setFilteredUsers(null);
  }, [currentFilters.pageSize]);

  const filterUsers = useCallback(async (filters: UserFilter): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Limpiar el estado anterior para evitar mezcla de datos
      setFilteredUsers(null);
      
      console.log('🔍 Enviando solicitud de filtrado de usuarios con parámetros:', filters);
      
      const response = await userService.filterUsers(
        filters.nombre,
        filters.apellido1,
        filters.apellido2,
        filters.cedula,
        filters.tipoUsuario, // Este campo depende de que hayas actualizado UserService.ts
        filters.pageNumber || 1,
        filters.pageSize || 10
      );

      console.log('✅ Respuesta completa del filtrado de usuarios:', response);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (!response.data) {
        console.error('❌ La respuesta no tiene data:', response);
        setError('Error en la respuesta del servidor');
        return;
      }

      if (!response.data.users) {
        console.error('❌ La respuesta no tiene users:', response.data);
        setError('Error en la estructura de la respuesta');
        return;
      }
      
      console.log(`✨ Datos filtrados obtenidos: ${response.data.users.length} usuarios, ${response.data.totalPages} páginas`);
      
      // Crear un nuevo objeto para el estado para garantizar que React detecte el cambio
      const newFilteredUsers = {
        users: [...response.data.users],
        totalPages: response.data.totalPages
      };
      
      // Actualizar el estado con los nuevos datos
      setFilteredUsers(newFilteredUsers);
      
      // Verificar que el estado fue actualizado correctamente (útil para depuración)
      setTimeout(() => {
        console.log('🔄 Estado actualizado después de filtrado:', {
          usersLength: newFilteredUsers.users.length,
          stateUpdated: true,
          updateCounter
        });
      }, 0);
      
    } catch (err) {
      console.error('❌ Error al filtrar usuarios:', err);
      const axiosError = err as AxiosError;
      setError(
        (axiosError.response?.data as { error?: string })?.error || 
        axiosError.message || 
        'Error al filtrar usuarios'
      );
      // Reiniciar el estado cuando hay un error
      setFilteredUsers(null);
    } finally {
      setLoading(false);
    }
  }, [updateCounter]);

  return {
    filteredUsers,
    loading,
    error,
    filterUsers,
    forceUpdate,
    // Nuevos campos para manejar el tipo de filtro
    filterType,
    setFilterType,
    searchTerm,
    setSearchTerm,
    applyFilter,
    clearFilter
  };
};

export default useFilterUsers;