import { useState, useCallback } from 'react';
import assetService, { AssetFilterDTO } from '../services/AssetService';
import { useToast } from '../hooks/useToast';
import { AssetType } from '../types/AssetType';

// Define una interfaz para la respuesta del API que usa nombres con mayúsculas
interface FilterAssetsResponse {
  Data?: AssetType[];
  TotalRecords?: number;
  PageNumber?: number;
  PageSize?: number;
  // Campos adicionales si existieran
}

interface UseFilterAssetsReturn {
  assets: AssetType[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filterAssets: (filter: AssetFilterDTO, pageNumber?: number, pageSize?: number) => Promise<void>;
}

export const useFilterAssets = (): UseFilterAssetsReturn => {
  const [assets, setAssets] = useState<AssetType[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const filterAssets = useCallback(
    async (filter: AssetFilterDTO, page: number = 1, size: number = 10) => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await assetService.filterAssets(filter, page, size);
        console.log('Respuesta original:', response);
        
        if (response && response.data) {
          console.log('Respuesta filtrado:', response.data);
          
          // Adaptamos el código para manejar tanto respuestas con propiedad 'data' como 'Data'
          const responseData = response.data as FilterAssetsResponse;
          
          // Si tenemos Data (con mayúscula inicial)
          if (responseData.Data && Array.isArray(responseData.Data)) {
            console.log('Estructura con Data (mayúscula)');
            setAssets(responseData.Data);
            setTotalRecords(responseData.TotalRecords || 0);
            setPageNumber(responseData.PageNumber || page);
            setPageSize(responseData.PageSize || size);
          }
          // Si es un array directamente
          else if (Array.isArray(responseData)) {
            console.log('La data es directamente un array:', responseData);
            setAssets(responseData);
            setTotalRecords(responseData.length);
            setPageNumber(page);
            setPageSize(size);
          }
          // Si es otro tipo de estructura, intentamos buscar campos relevantes
          else {
            console.log('Estructura alternativa, intentando adaptarse');
            
            // Intentamos buscar cualquier array en la respuesta que podría contener los activos
            if (Array.isArray(responseData)) {
              setAssets(responseData);
              setTotalRecords(responseData.length);
            } else {
              // Buscar cualquier propiedad que pueda ser un array de activos
              for (const key in responseData) {
                if (Array.isArray((responseData as any)[key])) {
                  console.log('Encontrado array en propiedad:', key);
                  setAssets((responseData as any)[key]);
                  
                  // Intentar encontrar el total de registros
                  if ((responseData as any).TotalRecords) {
                    setTotalRecords((responseData as any).TotalRecords);
                  } else if ((responseData as any).totalRecords) {
                    setTotalRecords((responseData as any).totalRecords);
                  } else {
                    setTotalRecords((responseData as any)[key].length);
                  }
                  
                  break;
                }
              }
            }
            
            // Configurar la paginación
            setPageNumber(page);
            setPageSize(size);
          }
          
          console.log('Assets extraídos:', assets);
        } else {
          console.log('Respuesta vacía o inválida');
          setAssets([]);
          setTotalRecords(0);
        }
      } catch (err) {
        console.error('Error en filterAssets:', err);
        const errorMessage = err instanceof Error 
          ? err.message 
          : "Error al filtrar activos";
        setError(errorMessage);
        showToast(errorMessage, 'error');
        setAssets([]);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    },
    [showToast] // Removido 'assets' de las dependencias para evitar loops
  );

  return {
    assets,
    totalRecords,
    pageNumber,
    pageSize,
    loading,
    error,
    filterAssets,
  };
};