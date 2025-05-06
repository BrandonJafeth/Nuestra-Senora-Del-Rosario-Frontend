// FILE: components/ConvertProductModal.tsx
import React, { useState } from "react";
import Modal from "react-modal";
import { useConvertProductUnit } from "../../hooks/useConvertProductUInit";
import { ConvertedData } from "../../types/ProductType";
import LoadingSpinner from "./LoadingSpinner";

interface ConvertProductModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  productId: number;
  targetUnit: string;
  productName: string;
  onConversionComplete: (updatedData: ConvertedData) => void;
}

const ConvertProductModal: React.FC<ConvertProductModalProps> = ({
  isOpen,
  onRequestClose,
  productId,
  targetUnit,
  productName,
  onConversionComplete,
}) => {
  // Estado para la unidad de conversión. Inicialmente se usa targetUnit.
  const [conversionUnit, setConversionUnit] = useState<string>(targetUnit);

  // Se ejecuta el hook con la unidad actual seleccionada.
  const { data, isLoading, isError } = useConvertProductUnit(
    productId,
    conversionUnit
  );

  // Forzamos el tipo para evitar que TS piense que data es un array.
  const typedData = (!Array.isArray(data) ? data : undefined) as
    | ConvertedData
    | undefined;

  // Función para confirmar la conversión.
  const handleConfirmConversion = () => {
    if (typedData) {
      onConversionComplete(typedData);
      onRequestClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Convertir Producto"
      ariaHideApp={false}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto outline-none"
    >
      <h2 className="text-xl font-bold mb-4 text-center dark:text-white">
        Conversión de Producto
      </h2>

      {/* Dropdown para seleccionar la unidad de medida */}
      <div className="mb-4">
        <label
          htmlFor="conversionUnit"
          className="block text-center mb-2 dark:text-white"
        >
          Selecciona la unidad a convertir:
        </label>
        <select
          id="conversionUnit"
          value={conversionUnit}
          onChange={(e) => setConversionUnit(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="">Seleccione una unidad de medida</option>

          {/* Opciones para leche: solo caja y litros */}
          {productName.toLowerCase() === "leche" && (
            <>
              <option value="caja">Caja</option>
              <option value="litro">Litros</option>
            </>
          )}

          {/* Opciones para pañales: paquete y unidad */}
          {productName.toLowerCase().startsWith("pañales") && (
            <>
              <option value="paquete">Paquete</option>
              <option value="unidad">Unidad</option>
            </>
          )}

          {/* Opciones para café: gramos y kilogramos */}
          {(productName.toLowerCase().startsWith("café") ||
            productName.toLowerCase().startsWith("cafe")) && (
            <>
              <option value="gramo">Gramos</option>
              <option value="kilogramo">Kilogramos</option>
            </>
          )}
        </select>
      </div>

      {isLoading && (
        <p className="text-center">
          Cargando conversión... <LoadingSpinner />
        </p>
      )}
      {isError && (
        <p className="text-center text-red-500">
          Error al obtener datos de conversión.
        </p>
      )}

      {typedData && (
        <div className="space-y-2 dark:text-white">
          <p>
            <strong>Producto:</strong> {typedData.name}
          </p>
          <p>
            <strong>Unidad original:</strong> {typedData.unitOfMeasure}
          </p>
          <p>
            <strong>Cantidad original:</strong> {typedData.totalQuantity}
          </p>
          <p>
            <strong>Unidad convertida:</strong>{" "}
            {typedData.convertedUnitOfMeasure}
          </p>
          <p>
            <strong>Cantidad convertida:</strong>{" "}
            {typedData.convertedTotalQuantity}
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-center space-x-4">
        {typedData && (
          <button
            onClick={handleConfirmConversion}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Confirmar
          </button>
        )}
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
