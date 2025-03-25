// FILE: src/components/ProductDropdownByCategory.tsx
import React from 'react';
import Select, { SingleValue } from 'react-select';
import { useAuth } from '../../hooks/useAuth';
import { Product } from '../../types/ProductType';
import { useAllProductsByCategory } from '../../hooks/useAllProductsByCategory';
import { useProducts } from '../../hooks/useProducts';

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
      />
    </div>
  );
};

export default ProductDropdownByCategory;
