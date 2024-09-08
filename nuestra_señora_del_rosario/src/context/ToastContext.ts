import { createContext} from 'react';
import { VariantType } from 'notistack';

// Interfaz para el contexto
export interface ToastContextProps {
  showToast: (message: string, variant?: VariantType) => void;
}

export const ToastContext = createContext<ToastContextProps | undefined>(undefined);


