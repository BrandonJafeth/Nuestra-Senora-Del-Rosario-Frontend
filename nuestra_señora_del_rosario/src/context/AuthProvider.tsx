// src/context/AuthProvider.tsx
import { ReactNode, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import AuthContext, { AuthContextProps } from "./AuthContext";

// Función para decodificar el JWT y extraer payload
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

// Función para extraer el timestamp de expiración en milisegundos
const getExpirationTimeMs = (token: string | null): number | null => {
  if (!token) return null;
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return null;
  // payload.exp viene en segundos, lo convertimos a milisegundos
  return payload.exp * 1000;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();

  // ------- Estados básicos -------
  const [token, setToken] = useState<string | null>(
    Cookies.get("authToken") || null
  );
  const [payload, setPayload] = useState<any | null>(decodeJWT(token));
  const [roles, setRoles] = useState<string[]>(
    payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || []
  );
  const [selectedRole, setSelectedRole] = useState<string | null>(
    Cookies.get("selectedRole") || null
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Ref para almacenar el ID del timer de expiración
  const logoutTimerRef = useRef<number | null>(null);

  // ------- Función de logout (ya declarada antes del useEffect) -------
  const logout = () => {
    // 1) Limpiar cualquier timer pendiente
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    // 2) Borrar estados y cookies
    setToken(null);
    setPayload(null);
    setIsAuthenticated(false);
    setRoles([]);
    setSelectedRole(null);
    Cookies.remove("authToken");
    Cookies.remove("selectedRole");

    // 3) Redirigir a /session-expired si no estamos ya allí
    if (window.location.pathname !== "/session-expired") {
      navigate("/", { replace: true });
    }
  };

  // ------- Función de login (también antes del useEffect) -------
  const login = (newToken: string) => {
    setToken(newToken);

    const decodedPayload = decodeJWT(newToken);
    setPayload(decodedPayload);

    const extractedRoles =
      decodedPayload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
    setRoles(Array.isArray(extractedRoles) ? extractedRoles : [extractedRoles]);

    setIsAuthenticated(true);
    Cookies.set("authToken", newToken, {
      expires: 1,
      secure: true,
      sameSite: "Strict",
    });
    // NOTA: Al cambiar `token`, se volverá a ejecutar el useEffect de abajo y programará un nuevo timer.
  };

  // ------- Función para seleccionar un rol (por si la usas) -------
  const setRole = (role: string) => {
    setSelectedRole(role);
    Cookies.set("selectedRole", role, {
      expires: 1,
      secure: true,
      sameSite: "Strict",
    });
  };

  // -------------------------------------------------------------------
  // Este efecto se encarga de:
  //  1) Verificar si el token existe.
  //  2) Decodificar payload y roles.
  //  3) Calcular cuánto falta para que expire y programar un timer.
  //  4) Si ya venció, invocar `logout()` de inmediato.
  // -------------------------------------------------------------------
  useEffect(() => {
    setIsLoading(true);

    if (!token) {
      // Si no hay token, no estamos autenticados
      setIsAuthenticated(false);
      setPayload(null);
      setRoles([]);
      setIsLoading(false);
      return;
    }

    // 1) Decodificar payload y actualizar estado
    const decodedPayload = decodeJWT(token);
    setPayload(decodedPayload);

    const extractedRoles =
      decodedPayload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
    setRoles(Array.isArray(extractedRoles) ? extractedRoles : [extractedRoles]);
    setIsAuthenticated(true);

    // 2) Calcular expiración
    const expirationTimeMs = getExpirationTimeMs(token);
    if (expirationTimeMs === null) {
      // Si no encontramos `exp` en el token, lo consideramos vencido
      console.warn("No se encontró 'exp' en el token. Cerrando sesión.");
      logout();
      setIsLoading(false);
      return;
    }

    const currentTime = Date.now();
    const msUntilExpiry = expirationTimeMs - currentTime;

    if (msUntilExpiry <= 0) {
      // Si ya expiró antes de montar el provider, salir inmediatamente
      console.warn("Token ya expirado al inicializar. Ejecutando logout.");
      logout();
      setIsLoading(false);
      return;
    }

    // 3) Programar el logout justo en el momento de expiración
    logoutTimerRef.current = window.setTimeout(() => {
      console.warn("Token vencido: realizando logout programado.");
      logout();
    }, msUntilExpiry);

    setIsLoading(false);

    // 4) Limpiar el timer cuando el token cambie o el componente se desmonte
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
    };
  }, [token, navigate]);

  // -------------------------------------------------------------------
  // Valor que se provee a través del contexto
  // -------------------------------------------------------------------
  const contextValue: AuthContextProps = {
    isAuthenticated,
    token,
    payload,
    roles,
    selectedRole,
    isLoading,
    login,
    logout,
    setRole,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
