import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Product } from '../../types/ProductType';
import { useUpdateProduct } from '../../hooks/useUpdateProduct';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
import { useCategories } from '../../hooks/useCategories';
import { useUnitOfMeasure } from '../../hooks/useUnitOfMeasure';

interface ProductEditModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  productId: number;
  initialProductData: Partial<Product>;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onRequestClose,
  productId,
  initialProductData,
}) => {
  const [productData, setProductData] = useState<Partial<Product>>(initialProductData);
  const [errors, setErrors] = useState<{ categoryID?: string; unitOfMeasureID?: string }>({});
  const [isEditing, setIsEditing] = useState(false);
  const updateProduct = useUpdateProduct();
  const { showToast, message, type } = useToast();
  const { data: categories } = useCategories();
  const { data: unitsOfMeasure } = useUnitOfMeasure();

  useEffect(() => {
    console.log('Initial product data:', initialProductData); // Verifica los datos iniciales
    setProductData(initialProductData); // Actualiza los datos iniciales del producto
  }, [initialProductData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const newErrors: { categoryID?: string; unitOfMeasureID?: string } = {};

    if (!productData.categoryID) {
      newErrors.categoryID = 'Selecciona una categoría';
    }
    if (!productData.unitOfMeasureID) {
      newErrors.unitOfMeasureID = 'Selecciona una unidad de medida';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateProduct.mutate(
      { id: productId, productPatch: productData },
      {
        onSuccess: () => {
          showToast('Producto actualizado exitosamente.', 'success');
          setTimeout(() => {
            onRequestClose();
            setIsEditing(false);
          }, 2000);
        },
        onError: () => {
          showToast('Hubo un error al actualizar el producto.', 'error');
        },
      }
    );
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => {
          setIsEditing(false);
          onRequestClose();
        }}
        contentLabel="Editar Producto"
        className="flex items-center justify-center min-h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40"
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Editar Producto</h2>
          <form className="space-y-4">
            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">Nombre:</span>
              <input
                type="text"
                name="name"
                value={productData.name || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </label>
            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">Categoría:</span>
              {isEditing ? (
                <select
                  name="categoryID"
                  value={productData.categoryID || ''}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-2 border ${
                    errors.categoryID ? 'border-red-500' : 'border-gray-300'
                  } dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories?.map((category) => (
                    <option key={category.categoryID} value={category.categoryID}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={
                  productData?.categoryName  
                  }
                  readOnly
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              )}
              {errors.categoryID && <p className="text-red-500 text-sm mt-1">{errors.categoryID}</p>}
            </label>
            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">Unidad de Medida:</span>
              {isEditing ? (
                <select
                  name="unitOfMeasureID"
                  value={productData.unitOfMeasureID || ''}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-2 border ${
                    errors.unitOfMeasureID ? 'border-red-500' : 'border-gray-300'
                  } dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                >
                  <option value="">Selecciona una unidad</option>
                  {unitsOfMeasure?.map((unit) => (
                    <option key={unit.unitOfMeasureID} value={unit.unitOfMeasureID}>
                      {unit.nombreUnidad}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={
                  productData?.unitOfMeasure
                  }
                  readOnly
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              )}
              {errors.unitOfMeasureID && <p className="text-red-500 text-sm mt-1">{errors.unitOfMeasureID}</p>}
            </label>
            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">Cantidad Total:</span>
              <input
                type="number"
                name="totalQuantity"
                value={productData.totalQuantity || 0}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </label>
          </form>
          <div className="flex justify-center mt-4">
            {isEditing ? (
              <div className='flex justify-center space-x-2'>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                  tabIndex={0}
                  >
                  Guardar
                </button>
                    <button
                      onClick={toggleEditMode}
                      className="ml-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                      tabIndex={1}
                      >
                      Cancelar
                    </button>
                  </div>
              
            ) : (
              <button
                onClick={toggleEditMode}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
              >
                Editar
              </button>
            )}
          </div>
        </div>
      </Modal>
      <Toast message={message} type={type} />
    </>
  );
};
  export default ProductEditModal;