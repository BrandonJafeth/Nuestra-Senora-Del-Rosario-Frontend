import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import { useCreateHealthcareCenter } from '../../hooks/useHealthcareCenter';
import { useThemeDark } from '../../hooks/useThemeDark';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';

// Asegurar que Modal esté correctamente configurado para el DOM
if (typeof window !== 'undefined') {
  Modal.setAppElement('#root');
}

interface AddHealthcareCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddHealthcareCenterModal: React.FC<AddHealthcareCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isDarkMode } = useThemeDark();

  const [name_HC, setName_HC] = useState('');
  const [location_HC, setLocation_HC] = useState('');
  const [type_HC, setType_HC] = useState(''); // Valor inicial: 'Público'
  const {showToast, message, type} = useToast();

  const { mutate, isLoading } = useCreateHealthcareCenter();

  // Asegurar que el body no tenga scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Validaciones
  if (!name_HC.trim()) {
    showToast('El nombre es obligatorio.', 'error');
    return;
  }

  if (name_HC.trim().length < 3) {
    showToast('El nombre debe tener al menos 3 caracteres.', 'error');
    return;
  }

  if (name_HC.trim().length > 50) {
    showToast('El nombre no puede exceder los 50 caracteres.', 'error');  
    return;
  }

  if (!/^[a-zA-Z\s]+$/.test(name_HC)) {
    showToast('El nombre solo puede contener letras y espacios.', 'error');
    return;
  }

  if (!location_HC.trim()) {
    showToast('La ubicación es obligatoria.', 'error');
    return;
  }

  if (location_HC.trim().length < 3) {
    showToast('La ubicación debe tener al menos 3 caracteres.', 'error');
    return;
  }

  if (location_HC.trim().length > 50) {
    showToast('La ubicación no puede exceder los 50 caracteres.', 'error');
    return;
  }

  if (!type_HC || type_HC === "") {
    showToast('El tipo es obligatorio.', 'error');
    return;
  }

  // Si todas las validaciones pasan, se procede con la mutación.
  mutate(
    { id_HC: 0, name_HC, location_HC, type_HC },
    {
      onSuccess: () => {
        showToast('Centro de atención creado exitosamente', 'success');
        setTimeout(() => {
          onClose();
        }, 2000);
      },
      onError: () => {
        showToast('Error al crear el centro de atención.', 'error');
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
    <>
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Agregar Centro de Atención"
      className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full mx-auto z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 1000
        },
        content: {
          position: 'relative',
          top: 'auto',
          left: 'auto',
          right: 'auto',
          bottom: 'auto',
          border: 'none',
          background: isDarkMode ? '#1F2937' : '#FFFFFF',
          padding: '20px',
          borderRadius: '8px'
        }
      }}
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
            
            className={inputStyles}
          />
        </div>

        {/* Tipo */}
        <div>
          <label className={labelStyles}>Tipo</label>
          <select
            value={type_HC}
            onChange={(e) => setType_HC(e.target.value)}
            
            className={`${inputStyles}`}
            >
            <option value="" >Seleccione un tipo</option>
           <option value="Público">Público</option>
            <option value="Privado">Privado</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg ${
              isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
            >
            {isLoading ? <LoadingSpinner /> : 'Guardar'}
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white mr-2"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </form>
      <Toast message={message} type={type} />
    </Modal>
            </>
  );
};

export default AddHealthcareCenterModal;
