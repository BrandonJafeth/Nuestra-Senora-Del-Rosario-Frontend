import { useState, useEffect } from 'react';
import userManagmentService from '../services/UserManagmentService';
import { User } from '../types/UserType';
import Cookies from 'js-cookie';

export const useUserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get('authToken'); // Obtener el token desde las cookies
       
        if (!token) throw new Error('No se encontró un token de autenticación');

        const response = await userManagmentService.getUserProfile(token);
        setUser(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  return { user, isLoading, error };
};
