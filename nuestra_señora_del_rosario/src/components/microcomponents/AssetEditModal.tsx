import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { AssetType } from "../../types/AssetType";
import { useThemeDark } from "../../hooks/useThemeDark";
import { useAssetCategory } from "../../hooks/useAssetCategory";
import { useModel } from "../../hooks/useModel";
import { useLaw } from "../../hooks/useLaw";

interface AssetEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAsset: AssetType;
  /** Se llama cuando se guarda el draft, pasando los datos editados al padre */
  onDraftSave: (draftData: Partial<AssetType>) => void;
}

const AssetEditModal: React.FC<AssetEditModalProps> = ({
  isOpen,
  onClose,
  initialAsset,
  onDraftSave,
}) => {
  const { isDarkMode } = useThemeDark();
  const { data: categories, isLoading: isLoadingCat } = useAssetCategory();
  const { data: models, isLoading: isLoadingModel } = useModel();
  const {data: laws} = useLaw();

  const [formData, setFormData] = useState<Partial<AssetType>>(initialAsset);
  const [isEditing, setIsEditing] = useState(false);

  // Cuando se abre el modal se carga la data inicial y se resetea el modo edición
  useEffect(() => {
    if (isOpen) {
      setFormData(initialAsset);
      setIsEditing(false);
    }
  }, [isOpen, initialAsset]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!isEditing) return;
    const { name, value } = e.target;
    if (name === "idAssetCategory" || name === "idModel") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDraftSave = () => {
    onDraftSave(formData);
    onClose();
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Clases base para inputs
  const baseInputClass = `mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`;
  const readOnlyClass = "bg-gray-200 cursor-not-allowed";

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setIsEditing(false);
        onClose();
      }}
      contentLabel="Editar Activo"
      className="flex items-center justify-center min-h-screen"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40"
    >
      <div
        className={`p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? "Editar Activo" : "Detalle del Activo"}
        </h2>
        {/* Contenedor de 2 columnas */}
        <div className="grid grid-cols-2 gap-4">
          {/* Columna 1 */}
          <div>
            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">
                Nombre del Activo:
              </span>
              <input
                type="text"
                name="assetName"
                value={formData.assetName || ""}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`${baseInputClass} ${!isEditing ? readOnlyClass : ""}`}
              />
            </label>

            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">
                Número de Serie:
              </span>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber || ""}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`${baseInputClass} ${!isEditing ? readOnlyClass : ""}`}
              />
            </label>

            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">
                Placa:
              </span>
              <input
                type="text"
                name="plate"
                value={formData.plate || ""}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`${baseInputClass} ${!isEditing ? readOnlyClass : ""}`}
              />
            </label>

            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">
                Costo Original:
              </span>
              <input
                type="number"
                name="originalCost"
                value={formData.originalCost || ""}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`${baseInputClass} ${!isEditing ? readOnlyClass : ""}`}
              />
            </label>

            <label className="block">
            <span className="text-gray-700 dark:text-gray-300">
                Ley:
              </span>
              {isLoadingCat ? (
                <p>Cargando leyes...</p>
              ) : isEditing ? (
                <select
                  name="idLaw"
                  value={formData.idLaw || ""}
                  onChange={handleInputChange}
                  className={baseInputClass}
                >
                  <option value="">Seleccione una ley</option>
                  {laws?.map((cat) => (
                    <option key={cat.idLaw} value={cat.idLaw}>
                      {cat.lawName}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={
                    categories?.find(
                      (c) => c.idAssetCategory === formData.idAssetCategory
                    )?.categoryName || ""
                  }
                  readOnly
                  className={`${baseInputClass} ${readOnlyClass}`}
                />
              )}
            </label>
          </div>

          {/* Columna 2 */}
          <div>
            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">
                Ubicación:
              </span>
              <input
                type="text"
                name="location"
                value={formData.location || ""}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`${baseInputClass} ${!isEditing ? readOnlyClass : ""}`}
              />
            </label>

            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">
                Fecha de Compra:
              </span>
              <input
                type="date"
                name="purchaseDate"
                value={formatDateForInput(formData.purchaseDate)}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`${baseInputClass} ${!isEditing ? readOnlyClass : ""}`}
              />
            </label>

            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">
                Categoría:
              </span>
              {isLoadingCat ? (
                <p>Cargando categorías...</p>
              ) : isEditing ? (
                <select
                  name="idAssetCategory"
                  value={formData.idAssetCategory || ""}
                  onChange={handleInputChange}
                  className={baseInputClass}
                >
                  <option value="">Seleccione una categoría</option>
                  {categories?.map((cat) => (
                    <option key={cat.idAssetCategory} value={cat.idAssetCategory}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={
                    categories?.find(
                      (c) => c.idAssetCategory === formData.idAssetCategory
                    )?.categoryName || ""
                  }
                  readOnly
                  className={`${baseInputClass} ${readOnlyClass}`}
                />
              )}
            </label>

            <label className="block">
              <span className="text-gray-700 dark:text-gray-300">
                Modelo:
              </span>
              {isLoadingModel ? (
                <p>Cargando modelos...</p>
              ) : isEditing ? (
                <select
                  name="idModel"
                  value={formData.idModel || ""}
                  onChange={handleInputChange}
                  className={baseInputClass}
                >
                  <option value="">Seleccione un modelo</option>
                  {models?.map((model) => (
                    <option key={model.idModel} value={model.idModel}>
                      {model.modelName} - {model.brandName}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={
                    models?.find((m) => m.idModel === formData.idModel)
                      ?.modelName || ""
                  }
                  readOnly
                  className={`${baseInputClass} ${readOnlyClass}`}
                />
              )}
            </label>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-center mt-4">
          {isEditing ? (
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={handleDraftSave}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
              >
                Guardar
              </button>
              <button
                onClick={toggleEditMode}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={toggleEditMode}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              Editar
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AssetEditModal;
