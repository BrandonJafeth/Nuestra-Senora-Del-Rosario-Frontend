import { createContext } from "react";

export interface IconContextProps {
    getIcon: (name: string) => JSX.Element | null;
  }
  
  const IconContext = createContext<IconContextProps | undefined>(undefined);

  export default IconContext