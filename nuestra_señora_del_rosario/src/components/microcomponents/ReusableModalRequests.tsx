import React from 'react';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const ReusableModalRequests: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  actions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div 
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-xl relative"
        style={{ maxHeight: '90vh', overflowY: 'auto' }} 
        // ↑ Opcional: limitas la altura y agregas scroll
      >
        {/* Botón de cierre */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white text-3xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Título */}
        <h3 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          {title}
        </h3>

        {/* Contenido dinámico */}
        <div 
          className="
            grid grid-cols-1 sm:grid-cols-2 
            gap-x-8 gap-y-4 mb-6 
            text-lg text-gray-700 dark:text-gray-300 
            break-words
          "
        >
          {children}
        </div>

        {/* Acciones (botones dinámicos) */}
        <div className="flex justify-center space-x-4 mt-8">
          {actions}
        </div>
      </div>
    </div>
  );
};

export default ReusableModalRequests;
