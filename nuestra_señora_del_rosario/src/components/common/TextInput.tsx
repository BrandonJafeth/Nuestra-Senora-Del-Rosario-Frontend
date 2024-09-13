// src/components/common/TextInput.tsx
import React from 'react';
import { useIcon } from '../../hooks/useIcons';
import { useThemeDark } from '../../hooks/useThemeDark'; // Hook para usar el ThemeContext
import { TextInputProps } from '../../types/CommonType';

const TextInput: React.FC<TextInputProps> = ({ type, placeholder, iconName, value, onChange }) => {
  const { getIcon } = useIcon();
  const { isDarkMode } = useThemeDark(); // Obtener el estado del modo oscuro

  return (
    <div className={`flex items-center border p-2 rounded mb-4 transition-colors duration-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}>
      <div className="text-gray-400 mr-3">{getIcon(iconName)}</div> {/* Renderizamos el icono */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-grow bg-transparent focus:outline-none"
      />
    </div>
  );
};

export default TextInput;
