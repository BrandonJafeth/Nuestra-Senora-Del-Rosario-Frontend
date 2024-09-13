import { createContext } from 'react';

export interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;  
  payload: any | null;  
  login: (token: string) => void;  
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export default AuthContext;
