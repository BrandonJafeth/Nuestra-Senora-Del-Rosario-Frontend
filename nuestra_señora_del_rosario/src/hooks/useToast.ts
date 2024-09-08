import { useContext } from "react";
import { ToastContext, ToastContextProps } from "../context/ToastContext";

// Hook personalizado para usar el toast
export const useToast = (): ToastContextProps => {
    const context = useContext(ToastContext);
    if (!context) {
      throw new Error('useToast debe usarse dentro de un ToastProvider');
    }
    return context;
  };