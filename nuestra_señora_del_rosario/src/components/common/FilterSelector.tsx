import React from 'react';
import SearchInput from './SearchInput';
import { FilterUserType } from '../../hooks/useFilterUsers';

interface FilterSelectorProps {
  filterType: FilterUserType;
  onFilterTypeChange: (type: FilterUserType) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
  isDarkMode?: boolean;
  isLoading?: boolean;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
  filterType,
  onFilterTypeChange,
  searchTerm,
  onSearchTermChange,
  onApplyFilter,
  onClearFilter,
  isDarkMode = false,
  isLoading = false,
}) => {
  // Opciones del filtro para el dropdown
  const filterOptions = [
    { value: FilterUserType.NONE, label: 'Sin filtro' },
    { value: FilterUserType.NAME, label: 'Nombre' },
    { value: FilterUserType.LASTNAME1, label: 'Primer Apellido' },
    { value: FilterUserType.LASTNAME2, label: 'Segundo Apellido' },
    { value: FilterUserType.DNI, label: 'Cédula' },
  ];

  // Manejar cambio en el tipo de filtro
  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as FilterUserType;
    onFilterTypeChange(newType);
    
    // Si se cambia a "Sin filtro", limpiar automáticamente
    if (newType === FilterUserType.NONE) {
      onClearFilter();
    }
  };

  // Manejar el envío del formulario (para cuando se presiona Enter)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filterType !== FilterUserType.NONE && searchTerm.trim()) {
      onApplyFilter();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3 items-center mb-4">
        {/* Dropdown para seleccionar tipo de filtro */}
        <div className="w-full sm:w-1/3">
          <select
            value={filterType}
            onChange={handleFilterTypeChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 
              ${isDarkMode 
                ? 'bg-gray-700 text-white focus:ring-blue-400' 
                : 'bg-white text-gray-700 focus:ring-blue-600'
              }`}
            disabled={isLoading}
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Campo de búsqueda (solo visible si hay un tipo de filtro seleccionado) */}
        {filterType !== FilterUserType.NONE && (
          <div className="w-full sm:w-2/3 flex">
            <SearchInput
              value={searchTerm}
              onChange={onSearchTermChange}
              placeholder={`Buscar por ${filterOptions.find(opt => opt.value === filterType)?.label || ''}`}
              isDarkMode={isDarkMode}
              className="flex-grow"
            />
            <button
              type="submit"
              className={`ml-2 px-4 py-2 rounded-lg text-white ${
                isLoading 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={isLoading || !searchTerm.trim()}
            >
              {isLoading ? 'Cargando...' : 'Filtrar'}
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default FilterSelector;