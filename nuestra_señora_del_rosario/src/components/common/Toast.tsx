import React from 'react';
import { ToastProps } from '../../types/CommonType';

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  if (!message) return null;

  // Definir los estilos según el tipo de mensaje (success, error, etc.)
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
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-transform transform ${
        getToastStyles()
      }`}
      style={{
        zIndex: 50, // Asegura que el Toast esté sobre otros elementos
        minWidth: '250px',
        maxWidth: '300px',
        opacity: 0.95, // Pequeña transparencia para hacerlo más amigable visualmente
      }}
    >
      {message}
    </div>
  );
};

export default Toast;