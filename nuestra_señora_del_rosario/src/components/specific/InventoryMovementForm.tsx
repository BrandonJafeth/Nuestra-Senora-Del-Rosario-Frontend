// components/InventoryMovementForm.tsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import { InventoryMovement } from '../../types/InventoryMovement';
import { useCreateInventoryMovement } from '../../hooks/useInventoryMovement';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';

Modal.setAppElement('#root');

interface InventoryMovementFormProps {
  isOpen: boolean;
  onClose: () => void;
  productID: number;
}

const InventoryMovementForm: React.FC<InventoryMovementFormProps> = ({ isOpen, onClose, productID }) => {
  const [formData, setFormData] = useState<InventoryMovement>({
    productID,
    quantity: 1, // Valor inicial positivo
    date: new Date().toISOString(),
    movementType: 'Ingreso',
  });

  const { isDarkMode } = useThemeDark();
  const { showToast, message, type } = useToast();
  const mutation = useCreateInventoryMovement();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseInt(value);

    // Validar que quantity sea mayor a 0 antes de actualizar el estado
    if (name === 'quantity' && parsedValue > 0) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: parsedValue,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData, {
      onSuccess: () => {
        showToast('Movimiento de inventario agregado con éxito.', 'success');
        setTimeout(onClose, 3000); // Espera 3 segundos antes de cerrar el modal
      },
      onError: (error) => {
        console.error(error);
        showToast('Hubo un error al agregar el movimiento.', 'error');
        setTimeout(onClose, 3000); // Espera 3 segundos antes de cerrar el modal
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
      width: '300px',
      backgroundColor: isDarkMode ? '#1e293b' : 'white',
      color: isDarkMode ? 'white' : 'black',
      border: isDarkMode ? '1px solid #475569' : '1px solid #d1d5db',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 1000,
    },
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Agregar Movimiento de Inventario"
        style={customStyles}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Agregar Movimiento de Inventario</h2>
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
              min="1" // Mínimo permitido en el input
              onChange={handleChange}
              className={`mt-1 block w-full border ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-black'} rounded-md shadow-sm`}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-200"
          >
            Confirmar Movimiento
          </button>
          <button
            type="button"
            onClick={() => {
                onClose();
            }}
            className="w-full px-4 py-2 mt-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition duration-200"
          >
            Cancelar
          </button>
        </form>
      </Modal>

      {/* Mostrar el Toast */}
      {message && <Toast message={message} type={type} />}
    </>
  );
};

export default InventoryMovementForm;
