import React from 'react';

// Definimos los tipos de las props
interface ButtonLoginProps {
  text: string;
  onClick: () => void;
  isDarkMode?: boolean;  // Añadimos isDarkMode como prop opcional
}

const ButtonLogin: React.FC<ButtonLoginProps> = ({ text, onClick, isDarkMode }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 rounded-md font-semibold transition ${
        isDarkMode ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'
      } hover:opacity-90`}
    >
      {text}
    </button>
  );
};

export default ButtonLogin;
