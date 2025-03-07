import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useThemeDark } from "../../hooks/useThemeDark";
import { MdWarning } from "react-icons/md"; // 🔹 Ícono de advertencia

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
  cancelText = "Cancelar",
  isLoading = false,
}) => {
  const { isDarkMode } = useThemeDark(); // 🔹 Obtener estado del modo oscuro

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div
        className={`p-8 rounded-lg shadow-lg w-[500px] min-h-[250px] transition-colors duration-300 ${
          isDarkMode ? "bg-[#0D313F] text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* 🔹 Ícono de advertencia y título más grande */}
        <div className="flex items-center mb-4">
          <MdWarning className="text-red-500 mr-3" size={35} />
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>

        {/* 🔹 Texto más grande y con más padding */}
        <p className="mb-6 text-lg">{message}</p>

        {/* 🔹 Botones más grandes y ajustados para eliminar el espacio extra */}
        <div className="flex justify-center gap-5 mt-4">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg shadow-md text-lg transition duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : isDarkMode
                ? "bg-blue-700 hover:bg-blue-800"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isLoading ? <LoadingSpinner /> : confirmText}
          </button>
          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-lg shadow-md text-lg transition duration-200 ${
              isDarkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"
            } text-white`}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
