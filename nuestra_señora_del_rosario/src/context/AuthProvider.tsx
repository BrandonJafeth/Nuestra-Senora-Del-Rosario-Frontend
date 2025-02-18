import { ReactNode, useState, useEffect } from "react";
import Cookies from "js-cookie";
import AuthContext from "./AuthContext";

// Función para decodificar el JWT
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(Cookies.get("authToken") || null);
  const [payload, setPayload] = useState<any | null>(token ? decodeJWT(token) : null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  const login = (newToken: string) => {
    setToken(newToken);
    setPayload(decodeJWT(newToken));
    setIsAuthenticated(true);
    Cookies.set("authToken", newToken, { expires: 7, secure: true, sameSite: "Strict" }); // Guardar por 7 días
  };

  const logout = () => {
    setToken(null);
    setPayload(null);
    setIsAuthenticated(false);
    Cookies.remove("authToken");
  };

  useEffect(() => {
    if (token) {
      setPayload(decodeJWT(token));
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, payload, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
