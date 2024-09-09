import React, { useState } from 'react';
import ToggleContext from './ToggleContext';


// Definir el tipo de las props que recibe el proveedor
interface ToggleProviderProps {
  children: React.ReactNode;
}

// Implementar el proveedor que manejará el estado del dropdown
const ToggleProvider: React.FC<ToggleProviderProps> = ({ children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <ToggleContext.Provider value={{ isDropdownOpen, toggleDropdown }}>
      {children}
    </ToggleContext.Provider>
  );
};

export default ToggleProvider;
