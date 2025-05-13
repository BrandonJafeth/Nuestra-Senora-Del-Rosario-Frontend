import React, { useEffect, useState } from 'react';
import { ToastProps } from '../../types/CommonType';

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000); // Se oculta después de 3 segundos
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message || !visible) return null;

  // Estilos según el tipo de mensaje
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-4 rounded-lg shadow-lg transition-opacity duration-300 ${getToastStyles()}`}
      style={{ minWidth: '300px', maxWidth: '350px', textAlign: 'center' }}
    >
      {message}
    </div>
  );
};

export default Toast;
