// src/components/common/ButtonLogin.tsx

import React from 'react';
import { useToast } from '../../hooks/useToast';

interface ButtonProps {
  text: string;
  onClick: () => void; 
  toastMessage: string; 
  toastType: 'success' | 'error' | 'warning' | 'info'; 
}

const ButtonLogin: React.FC<ButtonProps> = ({ text, onClick, toastMessage, toastType }) => {
  const { showToast } = useToast(); 

  const handleClick = () => {
    showToast(toastMessage, toastType); 
    onClick(); 
  };

  return (
    <button
      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default ButtonLogin;
