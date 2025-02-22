
import { useQuery } from "react-query";
import userManagmentService from "../services/UserManagmentService";
import { User } from "../types/UserType";
import { useAuth } from "./useAuth";

// Función para obtener el perfil del usuario
const fetchUserProfile = async (token: string | null): Promise<User> => {
  if (!token) throw new Error("No se encontró un token de autenticación");

  const response = await userManagmentService.getUserProfile(token);
  return response.data;
};

// Hook personalizado con React Query
export const useUserProfile = () => {
  const { token } = useAuth(); // Obtiene el token del contexto

  return useQuery<User, Error>({
    queryKey: ["userProfile", token], // Se reactualiza cuando cambia el token
    queryFn: () => fetchUserProfile(token),
    enabled: !!token, // Solo ejecuta la consulta si hay un token válido
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    retry: 2, // Reintenta la consulta 2 veces en caso de error
  });
};
