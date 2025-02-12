import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useThemeDark } from '../../hooks/useThemeDark';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = 'Cancelar',
  isLoading = false,
}) => {
  const { isDarkMode } = useThemeDark(); // 🔹 Obtener estado del modo oscuro

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`p-6 rounded-lg shadow-lg w-96 transition-colors duration-300 ${
          isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-900'
        }`}
      >
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg shadow-md transition duration-200 ${
              isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
            } text-white`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg shadow-md transition duration-200 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : isDarkMode
                ? 'bg-blue-700 hover:bg-blue-800'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isLoading ? <LoadingSpinner /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
