import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import assetService from "../services/AssetService";

export const useCheckAssetPlate = (plate: string, debounceMs = 800) => {
  const [debouncedPlate, setDebouncedPlate] = useState("");
  
  // Efecto para controlar el debounce
  useEffect(() => {
    if (plate.trim() === "") {
      setDebouncedPlate("");
      return;
    }

    // Configurar un temporizador para actualizar la placa después del tiempo de debounce
    const timer = setTimeout(() => {
      // Aunque el backend normaliza la placa, también podemos pre-procesarla aquí
      // para que la UI sea más predecible
      setDebouncedPlate(plate.trim());
    }, debounceMs);
    
    // Limpiar el temporizador si la placa cambia antes de que se cumpla el tiempo
    return () => clearTimeout(timer);
  }, [plate, debounceMs]);
  
  // Usar la placa con debounce para la consulta
  return useQuery(
    ["checkAssetPlate", debouncedPlate],
    async () => {
      if (!debouncedPlate || debouncedPlate.trim() === "") {
        return { exists: false };
      }
      
      try {
        // Usamos el endpoint específico para verificar la placa
        // El endpoint está en: https://bw48008o8ooo848csscss8o0.hogarnuestrasenoradelrosariosantacruz.org/api/Asset/verify-plate?plate=150
        const response = await assetService.checkPlateExists(debouncedPlate);
        if (typeof response.data === 'boolean') {
          return { exists: response.data };
        } else {
          return { exists: response.data.exists };
        }
      } catch (error) {
        console.error("Error al verificar placa del activo:", error);
        return { exists: false };
      }
    },
    {
      // Solo ejecutar cuando la placa con debounce tenga contenido
      enabled: !!debouncedPlate && debouncedPlate.trim() !== "",
      // Usar cache para evitar m�ltiples solicitudes con la misma placa
      cacheTime: 5 * 60 * 1000, // 5 minutos
      staleTime: 2 * 60 * 1000, // 2 minutos
    }
  );
};
