import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  errors?: Record<string, string>; // Para mostrar errores de validaci�n
  width?: string; // Para permitir personalizar el ancho del modal
}

const AdminModalAdd: React.FC<ModalProps> = ({ 
  isOpen, 
  title, 
  children, 
  onClose,
  errors = {}, 
  width = "w-96" 
}) => {
  if (!isOpen) return null;
  if (!onClose) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`bg-white p-6 rounded-lg shadow-lg ${width}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        {Object.keys(errors).length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm font-medium text-red-600 mb-1">Por favor, corrija los siguientes errores:</p>
            <ul className="list-disc pl-5 text-sm text-red-500">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default AdminModalAdd;
