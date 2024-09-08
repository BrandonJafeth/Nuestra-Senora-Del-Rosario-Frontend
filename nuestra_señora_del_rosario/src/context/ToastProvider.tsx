import  { ReactNode } from 'react';
import { VariantType, useSnackbar } from 'notistack';
import { ToastContext } from './ToastContext';

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();

  const showToast = (message: string, variant: VariantType = 'default') => {
    enqueueSnackbar(message, { variant });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};
