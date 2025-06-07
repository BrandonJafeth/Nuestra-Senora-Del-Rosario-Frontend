// FILE: src/components/ProductDropdownByCategory.tsx
import React from 'react';
import Select, { SingleValue, StylesConfig } from 'react-select';
import { useAuth } from '../../hooks/useAuth';
import { Product } from '../../types/ProductType';
import { useAllProductsByCategory } from '../../hooks/useAllProductsByCategory';
import { useProducts } from '../../hooks/useProducts';
import { useThemeDark } from '../../hooks/useThemeDark';

interface ProductDropdownProps {
  selectedProduct: number; 
  onProductSelect: (productId: number, productName: string) => void;
}

interface ProductOption {
  value: number;
  label: string;
}

const ProductDropdownByCategory: React.FC<ProductDropdownProps> = ({ selectedProduct, onProductSelect }) => {
  const { selectedRole } = useAuth();
  const { isDarkMode } = useThemeDark();

  // Mapeo de roles a categoría para roles distintos a Admin
  const roleToCategoryId: { [key: string]: number } = {
    Enfermeria: 4
  };

  // Variables para almacenar los datos, estado de carga y error.
  let productsData: Product[] | undefined;
  let isLoading: boolean, isError: boolean;

  // Lógica para Admin, Inventario y Enfermeria
  if (selectedRole === 'Admin') {
    const result = useProducts(1, 1000);
    productsData = result.data?.products;
    isLoading = result.isLoading;
    isError = result.isError;
  } else if (selectedRole === 'Inventario') {
    const result = useProducts(1, 1000);
    const allowedCategories = ['Limpieza', 'Alimentos'];
    productsData = result.data?.products?.filter(product =>
      allowedCategories.includes(product.categoryName)
    );
    isLoading = result.isLoading;
    isError = result.isError;
  } else {
    const categoryId = roleToCategoryId[selectedRole ?? ''] ?? 0;
    const result = useAllProductsByCategory(categoryId);
    productsData = result.data;
    isLoading = result.isLoading;
    isError = result.isError;
  }

  // Convertir los productos en opciones para react-select
  const options: ProductOption[] = (productsData || []).map((product: Product) => ({
    value: product.productID,
    label: product.name,
  }));

  // Determinar la opción seleccionada en base a su ID
  const selectedOption = options.find((opt) => opt.value === selectedProduct) || null;

  // Cuando se selecciona un producto, se envían id y nombre
  const handleChange = (selected: SingleValue<ProductOption>) => {
    onProductSelect(selected?.value || 0, selected?.label || '');
  };

  // Estilos personalizados para el dropdown según el tema
  const customStyles: StylesConfig<ProductOption, false> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#1F2937' : provided.backgroundColor,
      borderColor: isDarkMode ? '#374151' : provided.borderColor,
      boxShadow: state.isFocused 
        ? isDarkMode ? '0 0 0 1px #3B82F6' : provided.boxShadow 
        : provided.boxShadow,
      '&:hover': {
        borderColor: isDarkMode ? '#4B5563' : provided.borderColor,
      },
      transition: 'all 0.2s ease',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#1F2937' : provided.backgroundColor,
      boxShadow: isDarkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : provided.boxShadow,
      borderRadius: '0.375rem',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: isDarkMode 
        ? state.isSelected 
          ? '#3B82F6' 
          : state.isFocused 
            ? '#374151' 
            : '#1F2937' 
        : provided.backgroundColor,
      color: isDarkMode 
        ? state.isSelected 
          ? 'white' 
          : '#D1D5DB' 
        : provided.color,
      '&:active': {
        backgroundColor: isDarkMode ? '#3B82F6' : provided.backgroundColor,
      },
      cursor: 'pointer',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDarkMode ? '#D1D5DB' : provided.color,
    }),
    input: (provided) => ({
      ...provided,
      color: isDarkMode ? '#D1D5DB' : provided.color,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: isDarkMode ? '#9CA3AF' : provided.color,
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#4B5563' : provided.backgroundColor,
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: isDarkMode ? '#9CA3AF' : provided.color,
      '&:hover': {
        color: isDarkMode ? '#D1D5DB' : provided.color,
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: isDarkMode ? '#9CA3AF' : provided.color,
      '&:hover': {
        color: isDarkMode ? '#D1D5DB' : provided.color,
      },
    }),
    noOptionsMessage: (provided) => ({
      ...provided,
      color: isDarkMode ? '#D1D5DB' : provided.color,
    }),
  };

  if (isLoading) return <p>Cargando productos...</p>;
  if (isError) return <p>Error al cargar los productos.</p>;

  return (
    <div className="sm:flex-row items-start sm:items-center gap-2 max-w-sm w-full">
      <label
        htmlFor="product-select"
        className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block"
      >
        Producto:
      </label>
      <Select
        id="product-select"
        options={options}
        value={selectedOption}
        onChange={handleChange}
        isSearchable
        placeholder="Seleccione un producto"
        className="w-full"
        styles={customStyles}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: isDarkMode ? '#3B82F6' : theme.colors.primary,
            primary25: isDarkMode ? '#374151' : theme.colors.primary25,
            primary50: isDarkMode ? '#4B5563' : theme.colors.primary50,
            neutral0: isDarkMode ? '#1F2937' : theme.colors.neutral0,
            neutral5: isDarkMode ? '#374151' : theme.colors.neutral5,
            neutral10: isDarkMode ? '#4B5563' : theme.colors.neutral10,
            neutral20: isDarkMode ? '#6B7280' : theme.colors.neutral20,
            neutral30: isDarkMode ? '#9CA3AF' : theme.colors.neutral30,
            neutral40: isDarkMode ? '#D1D5DB' : theme.colors.neutral40,
            neutral50: isDarkMode ? '#9CA3AF' : theme.colors.neutral50,
            neutral60: isDarkMode ? '#D1D5DB' : theme.colors.neutral60,
            neutral70: isDarkMode ? '#F3F4F6' : theme.colors.neutral70,
            neutral80: isDarkMode ? '#F9FAFB' : theme.colors.neutral80,
            neutral90: isDarkMode ? '#FFFFFF' : theme.colors.neutral90,
          },
        })}
      />
    </div>
  );
};

export default ProductDropdownByCategory;