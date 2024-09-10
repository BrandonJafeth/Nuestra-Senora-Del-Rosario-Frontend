import { useEffect, useState } from "react";
import ThemeContext from "./ThemeContext";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
  
    const toggleDarkMode = () => {
      setIsDarkMode((prev) => !prev);
    };
  
    useEffect(() => {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [isDarkMode]);
  
    return (
      <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
        {children}
      </ThemeContext.Provider>
    );
  };