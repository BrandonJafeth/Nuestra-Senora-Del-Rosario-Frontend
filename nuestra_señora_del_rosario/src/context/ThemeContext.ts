import { createContext } from "react";

export interface ThemeContextProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
  }
  
  const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

  export default ThemeContext;