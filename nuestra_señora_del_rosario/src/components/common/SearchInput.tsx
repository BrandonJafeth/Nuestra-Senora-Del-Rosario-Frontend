import React, { useRef, useEffect } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDarkMode?: boolean;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Buscar',
  isDarkMode = false,
  className = '',
}) => {
  // Usar una referencia para mantener el foco
  const inputRef = useRef<HTMLInputElement>(null);

  // Este efecto se asegura de que el input mantenga el foco cuando está siendo utilizado
  useEffect(() => {
    // Solo reenfocamos si el input ya tenía el foco y lo perdió
    if (document.activeElement !== inputRef.current && inputRef.current === document.activeElement?.parentElement?.querySelector('input')) {
      inputRef.current?.focus();
    }
  });

  return (
    <div className="w-full flex items-center">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 
          ${isDarkMode ? 'bg-gray-700 text-white focus:ring-blue-400' : 'text-gray-700 focus:ring-blue-600'} 
          ${className}`}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="ml-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
          aria-label="Borrar búsqueda"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default React.memo(SearchInput); // Usar React.memo para prevenir re-renderizados innecesarios