import React from 'react';

interface TextInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDarkMode: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ type, placeholder, value, onChange, isDarkMode }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-3 rounded-md mb-4 border focus:outline-none ${
        isDarkMode
          ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
          : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'
      }`}
    />
  );
};

export default TextInput;
