import { ReactNode, useState, useEffect } from "react";
import Cookies from "js-cookie";
import AuthContext from "./AuthContext";

// Función para decodificar el JWT de forma segura
const decodeJWT = (token: string | null) => {
  if (!token) return null;
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

// Función para verificar si el token ha expirado
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return true;
    
    // La fecha de expiración está en segundos, convertimos a milisegundos
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    
    return currentTime > expirationTime;
  } catch (error) {
    console.error("Error al verificar la expiración del token:", error);
    return true;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(Cookies.get("authToken") || null);
  const [payload, setPayload] = useState<any | null>(decodeJWT(token));
  const [roles, setRoles] = useState<string[]>(payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || []);
  const [selectedRole, setSelectedRole] = useState<string | null>(Cookies.get("selectedRole") || null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (token) {
      // Verificar si el token ha expirado
      if (isTokenExpired(token)) {
        // Si el token ha expirado, hacer logout automáticamente
        console.warn("Token expirado, cerrando sesión automáticamente");
        logout();
      } else {
        const decodedPayload = decodeJWT(token);
        setPayload(decodedPayload);
        setRoles(decodedPayload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || []);
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
      setRoles([]);
    }
    setIsLoading(false);
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
    const decodedPayload = decodeJWT(newToken);
    setPayload(decodedPayload);
    const extractedRoles = decodedPayload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
    setRoles(Array.isArray(extractedRoles) ? extractedRoles : [extractedRoles]); // Asegurar array de roles
    setIsAuthenticated(true);

    // Guardar token en cookies
    Cookies.set("authToken", newToken, { expires: 1, secure: true, sameSite: "Strict" });
  };

  const logout = () => {
    setToken(null);
    setPayload(null);
    setIsAuthenticated(false);
    setRoles([]);
    setSelectedRole(null);
    Cookies.remove("authToken");
    Cookies.remove("selectedRole");
  };

  const setRole = (role: string) => {
    setSelectedRole(role);
    Cookies.set("selectedRole", role, { expires: 1, secure: true, sameSite: "Strict" });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, payload, roles, selectedRole, isLoading, login, logout, setRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};
