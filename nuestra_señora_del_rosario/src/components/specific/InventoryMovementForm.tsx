// components/InventoryMovementForm.tsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import { InventoryMovement } from '../../types/InventoryMovement';
import { useCreateInventoryMovement } from '../../hooks/useInventoryMovement';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
import LoadingSpinner from '../microcomponents/LoadingSpinner';

Modal.setAppElement('#root');

interface InventoryMovementFormProps {
  isOpen: boolean;
  onClose: () => void;
  productID: number;
}

const InventoryMovementForm: React.FC<InventoryMovementFormProps> = ({ isOpen, onClose, productID }) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState<InventoryMovement>({
    productID,
    quantity: 1,
    date: currentDate,
    movementType: 'Ingreso',
  });
  

  const { isDarkMode } = useThemeDark();
  const { showToast, message, type } = useToast();
  const mutation = useCreateInventoryMovement();
  const isLoading = mutation.isLoading;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseInt(value);

    if (name === 'quantity' && parsedValue > 0) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: parsedValue,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate([formData], {
      onSuccess: () => {
        showToast('Movimiento de inventario agregado con éxito.', 'success');
        setTimeout(onClose, 2000);
      },
      onError: (error) => {
        console.error(error);
        showToast('Hubo un error al agregar el movimiento.', 'error');
        setTimeout(onClose, 2000);
      },
    });
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      borderRadius: '10px',
      width: '320px',
      backgroundColor: isDarkMode ? '#1e293b' : 'white',
      color: isDarkMode ? 'white' : 'black',
      border: isDarkMode ? '1px solid #475569' : '1px solid #d1d5db',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 40,
    },
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Agregar Producto al Inventario"
        style={customStyles}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Agregar Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="quantity" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Cantidad
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              min="1"
              onChange={handleChange}
              className={`mt-1 block w-full border ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-black'} rounded-md shadow-sm text-lg font-semibold text-center`}
              required
            />
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="ml-4 px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
              tabIndex={0}
            >
              {isLoading ? <LoadingSpinner/> : 'Agregar'}
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
              }}
              className="ml-4 px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-200"
              tabIndex={1}
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      {/* Mostrar el Toast */}
      {message && <Toast message={message} type={type} />}
    </>
  );
};

export default InventoryMovementForm;
