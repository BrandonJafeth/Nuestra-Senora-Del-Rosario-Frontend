import { useContext } from 'react';
import ToggleContext, { ToggleContextProps } from '../context/ToggleContext';

const useToggle = (): ToggleContextProps => {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error('useSidebar debe ser usado dentro de un SidebarProvider');
  }
  return context;
};

export default useToggle;
