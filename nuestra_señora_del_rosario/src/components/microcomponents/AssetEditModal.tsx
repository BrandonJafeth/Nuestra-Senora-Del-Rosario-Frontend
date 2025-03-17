// components/AssetEditModal.tsx
import React, { useEffect, useState } from "react";
import { useThemeDark } from "../../hooks/useThemeDark";
import { AssetType } from "../../types/AssetType";

interface AssetEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAsset: AssetType;
  /** onDraftSave: se llama cuando el usuario hace clic en "Guardar" para pasar los datos editados al padre */
  onDraftSave: (draftData: Partial<AssetType>) => void;
}

const AssetEditModal: React.FC<AssetEditModalProps> = ({
  isOpen,
  onClose,
  initialAsset,
  onDraftSave,
}) => {
  const { isDarkMode } = useThemeDark();
  const [formData, setFormData] = useState<Partial<AssetType>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialAsset);
    }
  }, [isOpen, initialAsset]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** En vez de confirmar aquí, solo mandamos los datos al padre y cerramos el modal. */
  const handleDraftSave = () => {
    onDraftSave(formData);
    onClose(); // Cierra el modal de edición
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`p-6 rounded-lg shadow-lg w-96 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Editar Activo</h2>

        {/* Nombre del Activo */}
        <label className="block mb-2">Nombre del Activo:</label>
        <input
          type="text"
          name="assetName"
          value={formData.assetName || ""}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded-lg mb-4 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
        />

        {/* Número de Serie */}
        <label className="block mb-2">Número de Serie:</label>
        <input
          type="text"
          name="serialNumber"
          value={formData.serialNumber || ""}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded-lg mb-4 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
        />

        {/* Placa */}
        <label className="block mb-2">Placa:</label>
        <input
          type="text"
          name="plate"
          value={formData.plate || ""}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded-lg mb-4 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
        />

        {/* Costo Original */}
        <label className="block mb-2">Costo Original:</label>
        <input
          type="number"
          name="originalCost"
          value={formData.originalCost || ""}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded-lg mb-4 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
        />

        {/* Ubicación */}
        <label className="block mb-2">Ubicación:</label>
        <input
          type="text"
          name="location"
          value={formData.location || ""}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded-lg mb-4 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
        />

        {/* Condición */}
        <label className="block mb-2">Condición:</label>
        <input
          type="text"
          name="assetCondition"
          value={formData.assetCondition || ""}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded-lg mb-4 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
        />

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleDraftSave}
          >
            Guardar
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetEditModal;
