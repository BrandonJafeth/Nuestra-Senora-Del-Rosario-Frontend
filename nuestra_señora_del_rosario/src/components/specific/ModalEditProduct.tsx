// components/ProductEditModal.tsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useUpdateProduct } from '../../hooks/useUpdateProduct';
import { useProductById } from '../../hooks/useProductById';
import { useCategories } from '../../hooks/useCategories';
import { useUnitsOfMeasure } from '../../hooks/useUnitOfMeasure';
import { useToast } from '../../hooks/useToast';
import { useThemeDark } from '../../hooks/useThemeDark'; // Importar hook de modo oscuro
import Toast from '../common/Toast';
import { ProductPatchType } from '../../types/ProductPatchType';

interface ProductEditModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  productId: number | null;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({ isOpen, onRequestClose, productId }) => {
  const { mutate: updateProduct } = useUpdateProduct();
  const { data: product, isLoading: productLoading } = useProductById(productId);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: unitsOfMeasure, isLoading: unitsLoading } = useUnitsOfMeasure();
  const { message, type } = useToast();
  const { isDarkMode } = useThemeDark(); // Modo oscuro

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [selectedUnit, setSelectedUnit] = useState<number | undefined>();

  useEffect(() => {
    if (product && isOpen) {
      setName(product.name);
      setQuantity(product.totalQuantity);
      setSelectedCategory(product.categoryID);
      setSelectedUnit(product.unitOfMeasureID);
    }
  }, [product, isOpen]);

  const handleUpdate = () => {
    if (productId) {
      const patchData: ProductPatchType[] = [
        { op: 'replace', path: '/name', value: name },
        { op: 'replace', path: '/totalQuantity', value: quantity.toString() },
        { op: 'replace', path: '/categoryID', value: selectedCategory?.toString() || '' },
        { op: 'replace', path: '/unitOfMeasureID', value: selectedUnit?.toString() || '' },
      ];

      updateProduct(
        { id: productId, patchData },
        {
          onSuccess: () => {
            onRequestClose();
          },
        }
      );
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Editar Producto"
        className={`relative z-50 w-full max-w-md mx-auto p-6 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'
        }`}
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40"
      >
        <h2 className={`text-2xl font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Editar Producto
        </h2>
        {productLoading || categoriesLoading || unitsLoading ? (
          <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Cargando datos del producto...</p>
        ) : (
          <form className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Nombre del Producto
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Cantidad
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(Number(e.target.value))}
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                }`}
              >
                <option value="">Selecciona una categoría</option>
                {categories?.map((category) => (
                  <option key={category.categoryID} value={category.categoryID}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Unidad de Medida
              </label>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(Number(e.target.value))}
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                }`}
              >
                <option value="">Selecciona una unidad</option>
                {unitsOfMeasure?.map((unit) => (
                  <option key={unit.unitOfMeasureID} value={unit.unitOfMeasureID}>
                    {unit.nombreUnidad}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Actualizar
              </button>
              <button
                type="button"
                onClick={onRequestClose}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </Modal>
      {message && <Toast message={message} type={type} />}
    </>
  );
};

export default ProductEditModal;
