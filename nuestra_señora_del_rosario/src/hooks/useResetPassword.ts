import { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import resetPasswordService from '../services/ResetPasswordService';
import { ResetPasswordData } from '../types/ResetPasswordType';
import { useSearchParams } from 'react-router-dom';
import { useToast } from './useToast';  // Usamos el hook para manejar los toasts

export const useResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { showToast, message, type } = useToast();  // Usamos el hook para manejar los toasts

  // Capturar el token desde la URL
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Captura el token de la URL

  // Mutación para restablecer la contraseña
  const mutation = useMutation((data: ResetPasswordData) => resetPasswordService.updatePassword(data), {
    onSuccess: () => {
      showToast('¡Contraseña actualizada con éxito!', 'success');
    },
    onError: (error: any) => {
      console.error('Error al restablecer la contraseña:', error);
      showToast('Error al actualizar la contraseña. Intente nuevamente.', 'error');
    }
  });

  // Eliminar el token de la URL después de capturarlo
  useEffect(() => {
    if (token) {
      // Reemplazar la URL sin el token en la barra de direcciones
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [token]);  // Solo ejecuta esto si hay un token en la URL

  // Función handleSubmit que se puede usar en el componente
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar que las contraseñas coincidan antes de enviar
    if (newPassword !== confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    if (!token) {
      showToast('Token de restablecimiento no disponible.', 'error');
      return;
    }

    // Realizar la solicitud de restablecimiento de contraseña
    mutation.mutate({
      token,          // Token que viene desde la URL (aunque ya no visible)
      newPassword,    // Nueva contraseña ingresada
      confirmPassword // Confirmación de la nueva contraseña
    });
  };

  return {
    handleSubmit,     // Devuelve la función handleSubmit
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    ...mutation,
    message,          // Mensaje del toast
    type              // Tipo de toast (success, error, etc.)
  };
};
