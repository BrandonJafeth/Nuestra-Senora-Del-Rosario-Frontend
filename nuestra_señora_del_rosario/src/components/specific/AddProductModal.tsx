// FILE: components/ProductAddModal.tsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useCreateProduct } from '../../hooks/useCreateProduct';
import { Product } from '../../types/ProductType';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
import { useCategories } from '../../hooks/useCategories';
import { useUnitOfMeasure } from '../../hooks/useUnitOfMeasure';

interface ProductAddModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const ProductAddModal: React.FC<ProductAddModalProps> = ({ isOpen, onRequestClose }) => {
  const { isDarkMode } = useThemeDark();
  const createProductMutation = useCreateProduct();
  const { showToast, message, type } = useToast();
  const { data: unitsOfMeasure } = useUnitOfMeasure();
  const { data: categories } = useCategories();

  const [name, setName] = useState('');
  const [categoryID, setCategoryID] = useState(0);
  const [unitOfMeasureID, setUnitOfMeasureID] = useState(0);
  const [initialQuantity, setInitialQuantity] = useState(0);

  // Función para reiniciar el formulario
  const resetForm = () => {
    setName('');
    setCategoryID(0);
    setUnitOfMeasureID(0);
    setInitialQuantity(0);
  };

  const handleSubmit = () => {
    if (name && categoryID && unitOfMeasureID && initialQuantity > 0) {
      const newProduct: Product = { 
        productID: 0,
        name, 
        categoryID, 
        unitOfMeasureID, 
        initialQuantity, 
        totalQuantity: initialQuantity, 
        categoryName: '', 
        unitOfMeasure: '' 
      };

      createProductMutation.mutate(newProduct, {
        onSuccess: () => {
          showToast('Producto agregado exitosamente.', 'success');
          name && categoryID && unitOfMeasureID && initialQuantity > 0 && resetForm();
          // Reinicia el formulario y cierra el modal después de 2 segundos
          setTimeout(() => {
            resetForm();
            onRequestClose();
          }, 2000);
        },
        onError: () => {
          showToast('Hubo un error al agregar el producto.', 'error');
        },
      });
    } else {
      showToast('Por favor, completa todos los campos.', 'error');
    }
  };

  const handleCancel = () => {
    resetForm();
    onRequestClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleCancel}
        contentLabel="Agregar Producto"
        className={`relative z-50 w-full max-w-md mx-auto p-6 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Agregar Producto</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Nombre del Producto
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'
              }`}
              required
            />
          </div>
          <div>
            <label htmlFor="categoryID" className="block text-sm font-medium">
              Categoría
            </label>
            <select
              id="categoryID"
              value={categoryID}
              onChange={(e) => setCategoryID(parseInt(e.target.value))}
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'
              }`}
              required
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
            <label htmlFor="unitOfMeasureID" className="block text-sm font-medium">
              Unidad de Medida
            </label>
            <select
              id="unitOfMeasureID"
              value={unitOfMeasureID}
              onChange={(e) => setUnitOfMeasureID(parseInt(e.target.value))}
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'
              }`}
              required
            >
              <option value="">Selecciona una unidad</option>
              {unitsOfMeasure?.map((unit) => (
                <option key={unit.unitOfMeasureID} value={unit.unitOfMeasureID}>
                  {unit.nombreUnidad}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="initialQuantity" className="block text-sm font-medium">
              Cantidad Inicial
            </label>
            <input
              type="number"
              id="initialQuantity"
              value={initialQuantity}
              onChange={(e) => setInitialQuantity(Math.max(0, parseInt(e.target.value)))}
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'
              }`}
              required
            />
          </div>

          {/* Botones alineados horizontalmente */}
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="ml-4 px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
              tabIndex={0}
            >
              Agregar Producto
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="ml-4 px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-200"
              tabIndex={1}
            >
              Cancelar
            </button>
          </div>
        </form>
        {/* Mostrar el Toast */}
        {message && <Toast message={message} type={type} />}
      </Modal>
    </>
  );
};

export default ProductAddModal;
