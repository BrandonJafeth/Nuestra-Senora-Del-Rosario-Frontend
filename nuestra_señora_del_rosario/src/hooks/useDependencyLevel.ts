// src/hooks/useDependencyLevel.ts
import { useQuery } from 'react-query';
import { DependencyLevel } from '../types/DependencyLevelType';
import dependencyLevelService from '../services/DependencyLevelService';
import { ApiResponse } from '../types/AssetsCategoryType';

export const useDependencyLevel = () => {
  return useQuery<DependencyLevel[], Error>(
    'DependencyLevel',
    async () => {
      const response = await dependencyLevelService.getAllDependencyLevels() as unknown as { data: ApiResponse<DependencyLevel[]> };
      if (!response.data?.data || !Array.isArray(response.data.data)) {
        console.error('🚨 Error: Datos de niveles de dependencia no válidos', response);
        return [];
      }
      return response.data.data.map((item) => ({
        id_DependencyLevel: item.id_DependencyLevel ?? 0,
        levelName: item.levelName || 'Sin nombre',
      }));
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );
};
