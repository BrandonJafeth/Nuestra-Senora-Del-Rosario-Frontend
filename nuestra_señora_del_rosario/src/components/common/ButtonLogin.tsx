// src/components/common/ButtonLogin.tsx
import { useThemeDark } from '../../hooks/useThemeDark'; 
import { ButtonProps } from '../../types/CommonType';

const ButtonLogin = ({ text, onClick }: ButtonProps) => {
  const { isDarkMode } = useThemeDark(); 

  return (
    <button
      className={`w-full py-3 rounded-lg transition-colors duration-500 ${isDarkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default ButtonLogin;