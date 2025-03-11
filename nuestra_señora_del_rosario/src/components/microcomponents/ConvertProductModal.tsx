// FILE: components/ConvertProductModal.tsx
import React from 'react';
import Modal from 'react-modal';
import { useConvertProductUnit } from '../../hooks/useConvertProductUInit';
import { ConvertedData } from '../../types/ProductType';
import LoadingSpinner from './LoadingSpinner';

interface ConvertProductModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  productId: number;
  targetUnit: string;
}

const ConvertProductModal: React.FC<ConvertProductModalProps> = ({
  isOpen,
  onRequestClose,
  productId,
  targetUnit
}) => {
  const { data, isLoading, isError } = useConvertProductUnit(productId, targetUnit);

  // Forzamos el tipo para evitar que TS crea que data es un array de Products
  const typedData = (!Array.isArray(data) ? data : undefined) as ConvertedData | undefined;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Convertir Producto"
      ariaHideApp={false}
      // Clases para el overlay (fondo) y el contenedor principal
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto outline-none"
    >
      <h2 className="text-xl font-bold mb-4 text-center dark:text-white">
        Conversión de Producto
      </h2>

      {isLoading && <p className="text-center">Cargando conversión... {<LoadingSpinner/>}</p>}
      {isError && <p className="text-center text-red-500">Error al obtener datos de conversión.</p>}

      {typedData && (
        <div className="space-y-2 dark:text-white">
          <p>
            <strong>Nombre:</strong> {typedData.name}
          </p>
          <p>
            <strong>Unidad Original:</strong> {typedData.unitOfMeasure}
          </p>
          <p>
            <strong>Unidad Convertida:</strong> {typedData.convertedUnitOfMeasure}
          </p>
          <p>
            <strong>Cantidad Convertida:</strong> {typedData.convertedTotalQuantity}
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={onRequestClose}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

export default ConvertProductModal;
