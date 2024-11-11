import React, { useState } from 'react';
import Modal from 'react-modal';
import { InventoryMovement } from '../../types/InventoryMovement';
import { useProducts } from '../../hooks/useProducts';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
import { useCreateInventoryMovement } from '../../hooks/useInventoryMovement';

interface ProductRequestModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSave: (movement: InventoryMovement) => void;
}

const ProductRequestModal: React.FC<ProductRequestModalProps> = ({ isOpen, onRequestClose }) => {
  const { isDarkMode } = useThemeDark();
  const [selectedProductID, setSelectedProductID] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const pageSize = 10; // Número de productos por página

  const { data, isLoading } = useProducts(pageNumber, pageSize);
  const createInventoryMovement = useCreateInventoryMovement();
  const { showToast, message, type } = useToast();

  const handleSubmit = () => {
    if (selectedProductID && quantity > 0) {
      const movement: InventoryMovement = {
        productID: selectedProductID,
        quantity,
        date: new Date().toISOString(),
        movementType: 'Egreso',
      };

      createInventoryMovement.mutate(movement, {
        onSuccess: () => {
          showToast('Egreso registrado exitosamente.', 'success');
          setTimeout(onRequestClose, 3000);
        },
        onError: () => {
          showToast('Hubo un error al registrar el egreso.', 'error');
        },
      });
    } else {
      showToast('Por favor, completa todos los campos.', 'error');
    }
  };

  const handleNextPage = () => {
    if (data?.totalPages && pageNumber < data.totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Pedir Producto"
        className={`relative z-50 w-full max-w-md mx-auto p-6 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Registrar Egreso de Producto</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="product" className="block text-sm font-medium">
              Producto
            </label>
            <select
              id="product"
              value={selectedProductID ?? ''}
              onChange={(e) => setSelectedProductID(Number(e.target.value))}
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'
              }`}
              required
            >
              <option value="" disabled>
                {isLoading ? 'Cargando productos...' : 'Selecciona un producto'}
              </option>
              {data?.products.map((product) => (
                <option key={product.productID} value={product.productID}>
                  {product.name} ({product.unitOfMeasure})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium">
              Cantidad
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'
              }`}
              required
            />
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={pageNumber === 1}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Anterior
            </button>
            <span>Página {pageNumber} de {data?.totalPages}</span>
            <button
              type="button"
              onClick={handleNextPage}
              disabled={data && pageNumber === data.totalPages}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Siguiente
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={onRequestClose}
              className="ml-4 px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-200"
              tabIndex={1}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="ml-4 px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
              tabIndex={0}
            >
              Registrar Egreso
            </button>
          </div>
        </form>
      </Modal>

      {/* Mostrar el Toast */}
      {message && <Toast message={message} type={type} />}
    </>
  );
};

export default ProductRequestModal;
