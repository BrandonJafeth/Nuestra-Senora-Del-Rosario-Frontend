import React, { useState } from 'react';
import Modal from 'react-modal';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import { useCreateHealthcareCenter } from '../../hooks/useHealthcareCenter';
import { useThemeDark } from '../../hooks/useThemeDark'; // Importar el hook de tema

interface AddHealthcareCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddHealthcareCenterModal: React.FC<AddHealthcareCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isDarkMode } = useThemeDark(); // Usar el hook de tema oscuro

  const [name_HC, setName_HC] = useState('');
  const [location_HC, setLocation_HC] = useState('');
  const [type_HC, setType_HC] = useState('Public'); // Valor inicial: 'Public'

  const { mutate, isLoading } = useCreateHealthcareCenter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { id_HC: 0, name_HC, location_HC, type_HC },
      {
        onSuccess: () => {
          onClose(); // Cierra el modal al guardar con éxito
        },
      }
    );
  };

  // Estilos condicionales basados en el modo oscuro
  const inputStyles = `w-full p-2 border rounded ${
    isDarkMode
      ? 'bg-gray-700 border-gray-600 text-white'
      : 'bg-white border-gray-300 text-black'
  }`;

  const labelStyles = `block font-semibold mb-1 ${
    isDarkMode ? 'text-white' : 'text-gray-800'
  }`;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Agregar Centro de Atención"
      className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full mx-auto z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
        Agregar Centro de Atención
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className={labelStyles}>Nombre</label>
          <input
            type="text"
            value={name_HC}
            onChange={(e) => setName_HC(e.target.value)}
            required
            className={inputStyles}
          />
        </div>

        {/* Ubicación */}
        <div>
          <label className={labelStyles}>Ubicación</label>
          <input
            type="text"
            value={location_HC}
            onChange={(e) => setLocation_HC(e.target.value)}
            required
            className={inputStyles}
          />
        </div>

        {/* Tipo */}
        <div>
          <label className={labelStyles}>Tipo</label>
          <select
            value={type_HC}
            onChange={(e) => setType_HC(e.target.value)}
            required
            className={`${inputStyles} appearance-none`}
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white mr-2"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg ${
              isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isLoading ? <LoadingSpinner /> : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddHealthcareCenterModal;
