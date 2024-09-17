import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import passwordResetService from '../services/RequestPasswordService';
import { useToast } from './useToast';  
import { useState } from 'react';

export const useRequestsPassword = () => {
  const { showToast, message, type } = useToast();
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');  

  const requestPasswordMutation = useMutation((email: string) => passwordResetService.requestPasswordReset(email), {
    onSuccess: () => {
      showToast('Enlace de restablecimiento enviado exitosamente. Por favor revise su correo electrónico.', 'success');
    },
    onError: (error: any) => {
      console.error('Error al enviar el enlace de restablecimiento:', error);
      showToast('Error al enviar el enlace de restablecimiento. Por favor, inténtelo de nuevo.', 'error');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestPasswordMutation.mutate(email);
  };

  const handleCancel = () => {
    setEmail('');  
    navigate('/');  
  };

  return {
    requestPasswordMutation,
    handleSubmit,
    handleCancel,
    email,
    setEmail,
    message,
    type
  };
};
