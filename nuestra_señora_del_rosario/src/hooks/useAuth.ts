import { useContext } from "react";
import AuthContext, { AuthContextProps } from "../context/AuthContext";

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
