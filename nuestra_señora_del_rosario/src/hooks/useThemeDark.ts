import { useContext } from "react";
import ThemeContext, { ThemeContextProps } from "../context/ThemeContext";

export const useThemeDark = (): ThemeContextProps => {
    const context = useContext(ThemeContext);
    if (!context) {
      throw new Error('useThemeDark debe ser utilizado dentro de un ThemeProvider');
    }
    return context;
  };