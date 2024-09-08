import { useContext } from "react";
import IconsContext, { IconContextProps } from "../context/IconsContext";

export const useIcon = ():IconContextProps => {
    const context = useContext(IconsContext);
    if (!context) throw new Error('useIcon debe ser utilizado dentro de un IconProvider');
    return context;
  };