import React, { useState } from 'react';
import { Product } from '../../types/ProductType';
import { useProductsByCategory } from '../../hooks/useProductByCategory';

interface ProductDropdownProps {
  categoryId: number; // Se lo pasamos desde afuera, e.g. CategoryDropdown
  onProductSelect: (productId: number) => void;
}

const ProductDropdown: React.FC<ProductDropdownProps> = ({ categoryId, onProductSelect }) => {
  // Llamamos al hook para obtener productos
  const pageNumber = 1; // o el que necesites
  const pageSize = 10;  // o el que necesites
  const { data, isLoading, isError } = useProductsByCategory(categoryId, pageNumber, pageSize);

  // Estado local para el producto seleccionado
  const [selectedProduct, setSelectedProduct] = useState<number | ''>('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = Number(e.target.value);
    setSelectedProduct(productId);
    onProductSelect(productId);
  };

  if (!categoryId) {
    return <p>Seleccione una categoría primero.</p>;
  }

  if (isLoading) return <p>Cargando productos...</p>;
  if (isError) return <p>Error al cargar productos.</p>;

  
  const products: Product[] = Array.isArray(data) ? data : data?.item1 ?? [];

  return (
    <div>
      <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 mb-1">
        Producto:
      </label>
      <select
        id="product-select"
        className="p-2 border rounded w-full"
        value={selectedProduct}
        onChange={handleChange}
      >
        <option value="">-- Selecciona un producto --</option>
        {products.map((product) => (
          <option key={product.productID} value={product.productID}>
            {product.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductDropdown;
