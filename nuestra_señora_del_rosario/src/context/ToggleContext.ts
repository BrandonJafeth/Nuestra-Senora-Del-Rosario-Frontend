import { createContext } from 'react';

export interface ToggleContextProps {
    isDropdownOpen: boolean;
    toggleDropdown: () => void;
  }

const SidebarContext = createContext<ToggleContextProps | null>(null);

export default SidebarContext;
