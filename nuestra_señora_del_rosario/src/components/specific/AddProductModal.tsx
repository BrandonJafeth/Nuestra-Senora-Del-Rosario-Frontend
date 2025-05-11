// FILE: components/ProductAddModal.tsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useCreateProduct } from '../../hooks/useCreateProduct';
import { Product } from '../../types/ProductType';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
import { useCategories } from '../../hooks/useCategories';
import { useUnitOfMeasure } from '../../hooks/useUnitOfMeasure';
import { useCheckProductName } from '../../hooks/useCheckProductName';

interface ProductAddModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const ProductAddModal: React.FC<ProductAddModalProps> = ({ isOpen, onRequestClose }) => {
  const { isDarkMode } = useThemeDark();
  const createProductMutation = useCreateProduct();
  const { showToast, message, type } = useToast();
  const { data: unitsOfMeasure } = useUnitOfMeasure();
  const { data: categories } = useCategories();  const [name, setName] = useState('');
  const [categoryID, setCategoryID] = useState(0);
  const [unitOfMeasureID, setUnitOfMeasureID] = useState(0);
  const [initialQuantity, setInitialQuantity] = useState(0);
  const [nameError, setNameError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Utilizamos nuestro hook personalizado para verificar si el nombre ya existe
  // con un tiempo de debounce de 800ms
  const { data: productNameCheck, isLoading: checkingName } = useCheckProductName(name);
  // Efecto para actualizar el error cuando cambia el resultado de la verificación
  useEffect(() => {
    if (productNameCheck?.exists) {
      setNameError(`Ya existe un producto con el nombre '${name}'`);
      setIsTyping(false);
    } else if (productNameCheck !== undefined) {
      // Solo limpiamos el error si realmente hemos comprobado y no está escribiendo
      setNameError('');
    }
  }, [productNameCheck, name]);
  // Función para reiniciar el formulario
  const resetForm = () => {
    setName('');
    setCategoryID(0);
    setUnitOfMeasureID(0);
    setInitialQuantity(0);
    setNameError('');
    setFormSubmitted(false);
  };const handleSubmit = () => {
    // Marcar el formulario como enviado para mostrar errores visuales
    setFormSubmitted(true);
    
    // Validación básica
    if (!name.trim()) {
      showToast('El nombre del producto es obligatorio.', 'error');
      return;
    }
    
    if (!categoryID) {
      showToast('Debes seleccionar una categoría.', 'error');
      return;
    }
    
    if (!unitOfMeasureID) {
      showToast('Debes seleccionar una unidad de medida.', 'error');
      return;
    }
    
    if (initialQuantity <= 0) {
      showToast('La cantidad inicial debe ser mayor que cero.', 'error');
      return;
    }
    
    // Validación de nombre duplicado
    if (nameError) {
      showToast(nameError, 'error');
      return;
    }

    // Si pasamos todas las validaciones, creamos el producto
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
        // Reinicia el formulario y cierra el modal después de 2 segundos
        setTimeout(() => {
          resetForm();
          onRequestClose();
        }, 2000);
      },      onError: (error: unknown) => {
        // Manejo de errores específicos del backend
        const err = error as { response?: { data?: { message?: string } } };
        if (err.response?.data?.message?.includes('Ya existe un producto con el nombre')) {
          showToast(`Ya existe un producto con el nombre '${name}'.`, 'error');
        } else {
          showToast('Hubo un error al agregar el producto.', 'error');
        }
      },
    });
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
        contentLabel="Agregar producto"
        className={`relative z-50 w-full max-w-md mx-auto p-6 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Agregar producto</h2>
        <form className="space-y-4">          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Nombre del producto
            </label>            <div className="relative">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsTyping(true);
                  // Reiniciar el error cuando el usuario está escribiendo
                  if (nameError) setNameError('');
                }}
                onBlur={() => {
                  // Cuando el campo pierde el foco, desactivamos el estado de escritura
                  setIsTyping(false);
                }}
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                  isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'
                } ${nameError || (formSubmitted && !name.trim()) ? 'border-red-500' : ''}`}
                required
              />
              {isTyping && !checkingName && name.trim() !== '' && (
                <div className="absolute right-2 top-2">
                  <span className="text-xs text-blue-500">Escribiendo...</span>
                </div>
              )}
              {checkingName && (
                <div className="absolute right-2 top-2">
                  <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
            {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
            {formSubmitted && !name.trim() && !nameError && <p className="text-red-500 text-xs mt-1">El nombre del producto es obligatorio</p>}
          </div><div>
            <label htmlFor="categoryID" className="block text-sm font-medium">
              Categoría
            </label>
            <select
              id="categoryID"
              value={categoryID || ""}
              onChange={(e) => setCategoryID(parseInt(e.target.value) || 0)}
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'
              } ${formSubmitted && !categoryID ? 'border-red-500' : ''}`}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories?.map((category) => (
                <option key={category.categoryID} value={category.categoryID}>
                  {category.categoryName}
                </option>
              ))}
            </select>
            {formSubmitted && !categoryID && <p className="text-red-500 text-xs mt-1">Por favor, selecciona una categoría</p>}
          </div>          <div>
            <label htmlFor="unitOfMeasureID" className="block text-sm font-medium">
              Unidad de medida
            </label>
            <select
              id="unitOfMeasureID"
              value={unitOfMeasureID || ""}
              onChange={(e) => setUnitOfMeasureID(parseInt(e.target.value) || 0)}
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'
              } ${formSubmitted && !unitOfMeasureID ? 'border-red-500' : ''}`}
              required
            >
              <option value="">Selecciona una unidad</option>
              {unitsOfMeasure?.map((unit) => (
                <option key={unit.unitOfMeasureID} value={unit.unitOfMeasureID}>
                  {unit.nombreUnidad}
                </option>
              ))}
            </select>
            {formSubmitted && !unitOfMeasureID && <p className="text-red-500 text-xs mt-1">Por favor, selecciona una unidad de medida</p>}
          </div>          <div>
            <label htmlFor="initialQuantity" className="block text-sm font-medium">
              Cantidad inicial
            </label>
            <input
              type="number"
              id="initialQuantity"
              value={initialQuantity}
              onChange={(e) => setInitialQuantity(Math.max(0, parseInt(e.target.value)))}
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'
              } ${formSubmitted && initialQuantity <= 0 ? 'border-red-500' : ''}`}
              required
            />
            {formSubmitted && initialQuantity <= 0 && <p className="text-red-500 text-xs mt-1">La cantidad inicial debe ser mayor que cero</p>}
          </div>          {/* Botones alineados horizontalmente */}
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={createProductMutation.isLoading || checkingName}
              className={`ml-4 px-6 py-2 rounded-lg ${
                createProductMutation.isLoading || checkingName
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition duration-200`}
              tabIndex={0}
            >
              {createProductMutation.isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Agregando...
                </div>
              ) : (
                'Agregar producto'
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={createProductMutation.isLoading}
              className={`ml-4 px-6 py-2 rounded-lg ${
                createProductMutation.isLoading
                  ? 'bg-red-300 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600'
              } text-white transition duration-200`}
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
