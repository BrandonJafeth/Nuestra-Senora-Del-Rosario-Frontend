// FILE: components/modals/ReportSelectionModal.tsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import CategoryDropdown from '../microcomponents/CategoryDropdown';
import ProductDropdown from '../microcomponents/ProductDropdown';

interface ReportSelectionModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: (selection: {
    categoryId: number;
    productId: number;
    measure: string;
  }) => void;
}

const ReportSelectionModal: React.FC<ReportSelectionModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
}) => {
  // Estado para almacenar los valores seleccionados
  const [categoryId, setCategoryId] = useState<number>(0);
  const [productId, setProductId] = useState<number>(0);
  const [measure, setMeasure] = useState<string>('');

  // Cuando se seleccione una categoría
  const handleCategorySelect = (selectedId: number) => {
    setCategoryId(selectedId);
    setProductId(0); // Reinicia producto al cambiar de categoría
  };

  // Cuando se seleccione un producto
  const handleProductSelect = (selectedProductId: number) => {
    setProductId(selectedProductId);
  };

  // Cuando se seleccione la unidad
  const handleMeasureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMeasure(e.target.value);
  };

  // Confirmar y cerrar
  const handleConfirm = () => {
    onConfirm({ categoryId, productId, measure });
    onRequestClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Generar Reporte"
      ariaHideApp={false}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <h2 className="text-xl font-bold mb-4 text-center dark:text-white">
        Generar Reporte
      </h2>

      {/* Dropdown de Categoría */}
      <div className="mb-4">
        <CategoryDropdown onCategorySelect={handleCategorySelect} selectedCategory={0} />
      </div>

      {/* Dropdown de Productos (filtrado por categoría) */}
      <div className="mb-4">
        <ProductDropdown categoryId={categoryId} onProductSelect={handleProductSelect} />
      </div>

      {/* Dropdown de Unidad de Medida (hardcodeado) */}
      <div className="mb-4">
        <label htmlFor="measure-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Unidad de Medida:
        </label>
        <select
          id="measure-select"
          value={measure}
          onChange={handleMeasureChange}
          className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
        >
          <option value="">-- Selecciona una unidad --</option>
          <option value="caja">Caja</option>
          <option value="paquete">Paquete</option>
          <option value="litros">Litro</option>
        </select>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleConfirm}
          disabled={!categoryId || !productId || !measure}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-blue-300 "
        >
          Confirmar
        </button>
        <button
          onClick={onRequestClose}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

export default ReportSelectionModal;
