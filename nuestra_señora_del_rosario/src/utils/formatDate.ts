// src/utils/dateFormatter.ts
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha ISO a 'dd/MM/yyyy'
 */
export const formatDate = (isoDate: string): string => {
  return format(parseISO(isoDate), 'dd/MM/yyyy', { locale: es });
};

/**
 * Formatea la hora del formato 'HH:mm:ss' a 'HH:mm'
 */
export const formatTime = (time: string): string => {
  return time.substring(0, 5); // Ejemplo: "14:30"
};

export const formatLongDate = (isoDate: string): string => {
  return format(parseISO(isoDate), 'PPP', { locale: es });
};