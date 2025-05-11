import { useQuery } from 'react-query';
import { useState, useEffect } from 'react';
import productService from '../services/ProductService';

export const useCheckProductName = (productName: string, debounceMs = 800) => {
  const [debouncedName, setDebouncedName] = useState('');
  
  // Efecto para controlar el debounce
  useEffect(() => {
    // Solo configura el temporizador si el nombre tiene contenido
    if (productName.trim() === '') {
      setDebouncedName('');
      return;
    }
    
    // Configurar un temporizador para actualizar el nombre después del tiempo de debounce
    const timer = setTimeout(() => {
      setDebouncedName(productName);
    }, debounceMs);
    
    // Limpiar el temporizador si el nombre cambia antes de que se cumpla el tiempo
    return () => clearTimeout(timer);
  }, [productName, debounceMs]);
  
  // Usar el nombre con debounce para la consulta
  return useQuery(
    ['checkProductName', debouncedName],
    async () => {
      if (!debouncedName || debouncedName.trim() === '') {
        return { exists: false };
      }
      
      try {
        // Utilizamos el endpoint de filtro por nombre para verificar si existe un producto con este nombre
        const response = await productService.filterProductsByName(debouncedName, 1, 10);
        
        // Verificamos si alguno de los productos tiene exactamente el mismo nombre (ignorando mayúsculas/minúsculas)
        const exactMatch = response.data.products.some(
          (product: { name: string }) => product.name.toLowerCase() === debouncedName.toLowerCase()
        );
        
        return { exists: exactMatch };
      } catch (error) {
        console.error('Error al verificar nombre de producto:', error);
        return { exists: false };
      }
    },
    {
      // Solo ejecutar cuando el nombre con debounce tenga contenido
      enabled: !!debouncedName && debouncedName.trim() !== '',
      // Usar cache para evitar múltiples solicitudes con el mismo nombre
      cacheTime: 5 * 60 * 1000, // 5 minutos
      staleTime: 2 * 60 * 1000, // 2 minutos
    }
  );
};
