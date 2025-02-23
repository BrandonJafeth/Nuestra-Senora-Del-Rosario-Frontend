import { createContext } from "react";

export interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  payload: any | null;
  roles: string[];
  selectedRole: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  setRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export default AuthContext;
