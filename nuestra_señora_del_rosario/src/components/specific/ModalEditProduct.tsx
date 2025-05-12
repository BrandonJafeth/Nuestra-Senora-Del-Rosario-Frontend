// FILE: src/components/modals/ProductEditModal.tsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Product, ConvertedData } from '../../types/ProductType';
import { useUpdateProduct } from '../../hooks/useUpdateProduct';
import { useToast } from '../../hooks/useToast';
import { useCategories } from '../../hooks/useCategories';
import { useUnitOfMeasure } from '../../hooks/useUnitOfMeasure';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import ConvertProductModal from '../microcomponents/ConvertProductModal';

interface ProductEditModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  productId: number;
  initialProductData: Partial<Product>;
  onConversionComplete: (data: ConvertedData) => void; // ← callback
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onRequestClose,
  productId,
  initialProductData,
  onConversionComplete,
}) => {
  /* ─────────── estado principal ─────────── */
  const [productData, setProductData] = useState<Partial<Product>>(initialProductData);
  const [errors, setErrors] = useState<{ categoryID?: string; unitOfMeasureID?: string }>({});
  const [isEditing, setIsEditing] = useState(false);

  /* ─────────── estado del modal de conversión ─────────── */
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);



/* después */
const name = (productData.name ?? '').toLowerCase().trim();

const canConvert =
 ['leche', 'cafe', 'café'].includes(productData.name?.toLowerCase() ?? '') ||
  name.startsWith('leche') ||        // 'leche' o 'leche condensada'…
  name.startsWith('cafe')  ||        // 'cafe bolio'
  name.startsWith('café')  ||        // 'café bolio'
  name.startsWith('pañales');        // 'pañales adultos'

  /* ─────────── hooks externos ─────────── */
  const updateProduct = useUpdateProduct();
  const { showToast } = useToast();
  const { data: categories } = useCategories();
  const { data: unitsOfMeasure } = useUnitOfMeasure();

  /* ─────────── sincronizar datos iniciales ─────────── */
  useEffect(() => {
    setProductData(initialProductData);
  }, [initialProductData]);

  /* ─────────── manejar cambios de inputs ─────────── */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  /* ─────────── guardar edición ─────────── */
  const handleSave = () => {
    const newErrors: { categoryID?: string; unitOfMeasureID?: string } = {};
    if (!productData.categoryID) newErrors.categoryID = 'Selecciona una categoría';
    if (!productData.unitOfMeasureID) newErrors.unitOfMeasureID = 'Selecciona una unidad';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    updateProduct.mutate(
      { id: productId, productPatch: productData },
      {
        onSuccess: () => {
          showToast('Producto actualizado exitosamente.', 'success');
          setIsEditing(false);
          onRequestClose();
        },
        onError: () => showToast('Hubo un error al actualizar el producto.', 'error'),
      }
    );
  };

  /* ─────────── helpers UI ─────────── */
  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
    setErrors({});
  };

  const openConvertModal = () => setIsConvertModalOpen(true);
  const closeConvertModal = () => setIsConvertModalOpen(false);

  /* ─────────── render ─────────── */
  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => {
          setIsEditing(false);
          onRequestClose();
        }}
        contentLabel="Editar producto"
        className="flex items-center justify-center min-h-screen"
        overlayClassName="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Editar producto
          </h2>

          {/* ─────────── formulario ─────────── */}
          <form className="space-y-4">
            {/* Nombre */}
            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">Nombre:</span>
              <input
                type="text"
                name="name"
                value={productData.name || ''}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`mt-1 block w-full px-4 py-2 border rounded-md focus:ring-2
                  ${!isEditing ? 'bg-gray-200 dark:bg-gray-600 cursor-not-allowed' : ''}
                  border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white`}
              />
            </label>

            {/* Categoría */}
            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">Categoría:</span>
              {isEditing ? (
                <select
                  name="categoryID"
                  value={productData.categoryID || ''}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-2 rounded-md focus:ring-2
                    ${errors.categoryID ? 'border-red-500' : 'border-gray-300'}
                    dark:border-gray-700 dark:bg-gray-700 dark:text-white`}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories?.map((c) => (
                    <option key={c.categoryID} value={c.categoryID}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={productData.categoryName || ''}
                  readOnly
                  className="mt-1 block w-full px-4 py-2 border rounded-md bg-gray-200
                    cursor-not-allowed border-gray-300 dark:border-gray-700
                    dark:bg-gray-700 dark:text-white"
                />
              )}
              {errors.categoryID && <p className="text-red-500 text-sm">{errors.categoryID}</p>}
            </label>

            {/* Unidad de medida */}
            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">Unidad de Medida:</span>
              {isEditing ? (
                <select
                  name="unitOfMeasureID"
                  value={productData.unitOfMeasureID || ''}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-2 rounded-md focus:ring-2
                    ${errors.unitOfMeasureID ? 'border-red-500' : 'border-gray-300'}
                    dark:border-gray-700 dark:bg-gray-700 dark:text-white`}
                >
                  <option value="">Selecciona una unidad</option>
                  {unitsOfMeasure?.map((u) => (
                    <option key={u.unitOfMeasureID} value={u.unitOfMeasureID}>
                      {u.nombreUnidad}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={productData.unitOfMeasure || ''}
                  readOnly
                  className="mt-1 block w-full px-4 py-2 border rounded-md bg-gray-200
                    cursor-not-allowed border-gray-300 dark:border-gray-700
                    dark:bg-gray-700 dark:text-white"
                />
              )}
              {errors.unitOfMeasureID && (
                <p className="text-red-500 text-sm">{errors.unitOfMeasureID}</p>
              )}
            </label>

            {/* Cantidad total */}
            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">Cantidad total:</span>
              <input
                type="number"
                name="totalQuantity"
                value={productData.totalQuantity || 0}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`mt-1 block w-full px-4 py-2 border rounded-md focus:ring-2
                  ${!isEditing ? 'bg-gray-200 dark:bg-gray-600 cursor-not-allowed' : ''}
                  border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white`}
              />
            </label>
          </form>

          {/* ─────────── botones ─────────── */}
          <div className="flex flex-col sm:flex-row sm:justify-between mt-6 space-y-3 sm:space-y-0">
            {isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  {updateProduct.isLoading ? <LoadingSpinner /> : 'Guardar'}
                </button>
                <button
                  onClick={toggleEditMode}
                  className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Cancelar
                </button>
              </div>
            ) : (
             <div className="flex justify-center space-x-2">
  {/* Editar */}
  <button
    onClick={toggleEditMode}
    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
  >
    Editar
  </button>

  {/* Convertir (sólo si aplica) */}
  {canConvert && (
    <button
      onClick={openConvertModal}
      className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      Convertir
    </button>
  )}
</div>
            )}

          </div>
        </div>
      </Modal>

      {/* ─────────── modal de conversión ─────────── */}
      {isConvertModalOpen && (
        <ConvertProductModal
          isOpen={isConvertModalOpen}
          onRequestClose={closeConvertModal}
          productId={productId}
          targetUnit={productData.unitOfMeasure!}
          productName={productData.name!}
          onConversionComplete={(data) => {
            onConversionComplete(data);
            closeConvertModal();
          }}
        />
      )}
    </>
  );
};

export default ProductEditModal;
