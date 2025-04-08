// FILE: components/CategoryReportModal.tsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import CategoryDropdown from '../microcomponents/CategoryDropdown';

interface CategoryReportModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: (categoryId: number) => void;
}

const CategoryReportModal: React.FC<CategoryReportModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  const handleConfirm = () => {
    if (selectedCategory) {
      onConfirm(selectedCategory);
      onRequestClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Seleccionar Categoría para Reporte"
     

      
      className="
        relative 
        w-full 
        max-w-[500px] 
        mx-auto 
        p-8 
        rounded-lg 
        shadow-lg 
        bg-white 
        dark:bg-gray-800 
        outline-none
      "
      overlayClassName="
        fixed 
        inset-0 
        bg-black 
        bg-opacity-50 
        flex 
        items-center 
        justify-center 
        z-50
      "
    >
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
        Seleccione una categoría para el reporte
      </h2>

      <div className="mb-6">
        <CategoryDropdown
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleConfirm}
          disabled={!selectedCategory}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-gray-400"
        >
          Confirmar
        </button>
        <button
          onClick={onRequestClose}
          className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

export default CategoryReportModal;
