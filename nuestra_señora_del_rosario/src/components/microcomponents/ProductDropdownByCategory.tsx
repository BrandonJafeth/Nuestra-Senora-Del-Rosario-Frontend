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
    Enfermeria: 4,
    Inventario: 2,
  };

  // Para Admin: usaremos el hook que trae TODOS los productos
  // Para los demás roles: se usa el ID correspondiente del mapeo.
  const categoryId = selectedRole === 'Admin'
    ? 0
    : (roleToCategoryId[selectedRole ?? ''] ?? 0);

  // Variables para almacenar los datos, estado de carga y error.
  let productsData: Product[] | undefined;
  let isLoading: boolean, isError: boolean;

  if (selectedRole === 'Admin') {
    // Para Admin usamos el hook que trae todos los productos (useProducts)
    const result = useProducts(1, 100); // Ajusta página según necesites
    productsData = result.data?.products;
    isLoading = result.isLoading;
    isError = result.isError;
  } else {
    // Para otros roles usamos el hook que filtra por categoría
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
