import { createContext } from 'react';

export interface AuthContextProps {  // Ahora está exportado
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export default AuthContext;
