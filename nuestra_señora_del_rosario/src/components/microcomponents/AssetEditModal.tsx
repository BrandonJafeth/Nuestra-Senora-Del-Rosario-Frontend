// components/AssetEditModal.tsx
import React, { useEffect, useState } from "react";
import { useThemeDark } from "../../hooks/useThemeDark";
import { AssetType } from "../../types/AssetType";
import { useAssetCategory } from "../../hooks/useAssetCategory";
import { useModel } from "../../hooks/useModel";

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

  // Estados para el formulario
  const [formData, setFormData] = useState<Partial<AssetType>>({});

  // Cargar categorías y modelos
  const { data: categories, isLoading: isLoadingCat } = useAssetCategory();
  const { data: models, isLoading: isLoadingModel } = useModel();

  // Cuando se abra el modal, cargamos los datos iniciales en el formulario
  useEffect(() => {
    if (isOpen) {
      setFormData(initialAsset);
    }
  }, [isOpen, initialAsset]);

  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

  /** Manejo de cambios en inputs de texto, número y fecha */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Para idAssetCategory e idModel, convertimos el valor a número
    if (name === "idAssetCategory" || name === "idModel") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /** Lógica para guardar (enviamos el draft al padre y cerramos el modal) */
  const handleDraftSave = () => {
    onDraftSave(formData);
    onClose(); // Cierra el modal de edición
  };

  // Formatear la fecha para usarla en un input type="date" (opcional)
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    // Queremos YYYY-MM-DD
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Clases de estilo reutilizables
  const inputClass = `w-full p-2 border rounded-lg ${
    isDarkMode
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-white border-gray-300 text-black"
  }`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`p-6 rounded-lg shadow-lg w-[600px] ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Editar Activo</h2>

        {/* Contenedor de 2 columnas */}
        <div className="grid grid-cols-2 gap-4">
          {/* Columna 1 */}
          <div>
            <label className="block mb-2">Nombre del Activo:</label>
            <input
              type="text"
              name="assetName"
              value={formData.assetName || ""}
              onChange={handleInputChange}
              className={`${inputClass} mb-4`}
            />

            <label className="block mb-2">Número de Serie:</label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber || ""}
              onChange={handleInputChange}
              className={`${inputClass} mb-4`}
            />

            <label className="block mb-2">Placa:</label>
            <input
              type="text"
              name="plate"
              value={formData.plate || ""}
              onChange={handleInputChange}
              className={`${inputClass} mb-4`}
            />

            <label className="block mb-2">Costo Original:</label>
            <input
              type="number"
              name="originalCost"
              value={formData.originalCost || ""}
              onChange={handleInputChange}
              className={`${inputClass} mb-4`}
            />
          </div>

          {/* Columna 2 */}
          <div>
            <label className="block mb-2">Ubicación:</label>
            <input
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={handleInputChange}
              className={`${inputClass} mb-4`}
            />

          <label className="block mb-2">Fecha de Compra:</label>
            <input
              type="date"
              name="purchaseDate"
              value={formatDateForInput(formData.purchaseDate)}
              onChange={handleInputChange}
              className={`${inputClass} mb-4`}
            />

            <label className="block mb-2">Categoría:</label>
            {isLoadingCat ? (
              <p className="mb-4">Cargando categorías...</p>
            ) : (
              <select
                name="idAssetCategory"
                value={formData.idAssetCategory || 0}
                onChange={handleInputChange}
                className={`${inputClass} mb-4`}
              >
                <option value={0}>Seleccione una categoría</option>
                {categories?.map((cat) => (
                  <option key={cat.idAssetCategory} value={cat.idAssetCategory}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            )}

            <label className="block mb-2">Modelo:</label>
            {isLoadingModel ? (
              <p className="mb-4">Cargando modelos...</p>
            ) : (
              <select
                name="idModel"
                value={formData.idModel || 0}
                onChange={handleInputChange}
                className={`${inputClass} mb-4`}
              >
                <option value={0}>Seleccione un modelo</option>
                {models?.map((model) => (
                  <option key={model.idModel} value={model.idModel}>
                    {model.modelName} - {model.brandName}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 mt-4">
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
