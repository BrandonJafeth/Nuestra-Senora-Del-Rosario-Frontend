import { useQuery } from "react-query";
import userManagmentService from "../services/UserManagmentService";
import { User } from "../types/UserType";
import Cookies from "js-cookie";

// Función para obtener el perfil del usuario
const fetchUserProfile = async (): Promise<User> => {
  const token = Cookies.get("authToken"); // Obtener token de autenticación
  if (!token) throw new Error("No se encontró un token de autenticación");

  const response = await userManagmentService.getUserProfile(token);
  return response.data;
};

// Hook personalizado con React Query
export const useUserProfile = () => {
  return useQuery<User, Error>({
    queryKey: ["userProfile"], // Clave única para identificar la consulta
    queryFn: fetchUserProfile, // Función que obtiene los datos
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    retry: 2, // Reintenta la consulta 2 veces en caso de error
  });
};
