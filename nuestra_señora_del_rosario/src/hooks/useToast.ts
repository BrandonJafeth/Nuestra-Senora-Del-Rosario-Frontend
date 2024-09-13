// src/hooks/useToast.ts

import { useState } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

export const useToast = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<ToastType | null>(null);

  const showToast = (msg: string, toastType: ToastType = 'info') => {
    setMessage(msg);
    setType(toastType);

    setTimeout(() => {
      setMessage(null);
      setType(null);
    }, 3000); // El mensaje de toast se ocultará después de 3 segundos
  };

  return {
    showToast,
    message,
    type,
  };
};
