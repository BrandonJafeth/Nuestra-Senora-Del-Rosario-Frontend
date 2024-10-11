
import { useQuery } from 'react-query';
import dependencyLevelService from '../services/DependencyLevelService';

export const useDependencyLevel = () => {
  return useQuery('dependencyLevels', async () => {
    const response = await dependencyLevelService.getAllDependencyLevels();
    return response.data; // Verifica que la respuesta tenga el formato adecuado
  });
};
