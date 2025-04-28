import { useState, useCallback } from 'react';
import assetService, { AssetFilterDTO } from '../services/AssetService';
import { useToast } from '../hooks/useToast';
import { AssetType } from '../types/AssetType';

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
          
          // Si la respuesta data contiene un array de data, estamos en el primer nivel
          if (Array.isArray(response.data.data)) {
            console.log('Estructura con data.data');
            setAssets(response.data.data);
            setTotalRecords(response.data.totalRecords || 0);
            setPageNumber(response.data.pageNumber || page);
            setPageSize(response.data.pageSize || size);
          }
          // Si la respuesta data contiene un array de Data, estamos en el primer nivel
          else if (Array.isArray(response.data.Data)) {
            console.log('Estructura con data.Data');
            setAssets(response.data.Data);
            setTotalRecords(response.data.TotalRecords || 0);
            setPageNumber(response.data.PageNumber || page);
            setPageSize(response.data.PageSize || size);
          }
          // Si la respuesta data es directamente un array, estamos en el segundo nivel
          else if (Array.isArray(response.data)) {
            console.log('La data es directamente un array:', response.data);
            setAssets(response.data);
            setTotalRecords(response.data.length);
            setPageNumber(page);
            setPageSize(size);
          }
          else {
            // Si la estructura es completamente diferente a las anteriores
            console.log('Estructura alternativa, revisando campos individuales');
            
            // Check si la respuesta tiene la estructura correcta
            if (response.data && response.data.data && Array.isArray(response.data.data)) {
              console.log('Encontrado en data.data');
              setAssets(response.data.data);
              setTotalRecords(response.data.totalRecords || 0);
            } else if (response.data && response.data.Data && Array.isArray(response.data.Data)) {
              console.log('Encontrado en data.Data');
              setAssets(response.data.Data);
              setTotalRecords(response.data.TotalRecords || 0);
            } else {
              console.log('Intentando extraer directamente de la respuesta');
              // Buscar cualquier array en la respuesta
              for (const key in response.data) {
                if (Array.isArray(response.data[key])) {
                  console.log('Encontrado array en:', key);
                  setAssets(response.data[key]);
                  break;
                }
              }
            }
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
    [assets, showToast]
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