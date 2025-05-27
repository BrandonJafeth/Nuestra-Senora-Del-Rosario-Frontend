import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { AssetType } from "../../types/AssetType";
import { useThemeDark } from "../../hooks/useThemeDark";
import { useAssetCategory } from "../../hooks/useAssetCategory";
import { useModel } from "../../hooks/useModel";
import { useFundingEntity } from "../../hooks/useFundingEntity";
// Importamos el Toast y el hook, pero ya no usaremos showToast en este componente
import Toast from "../common/Toast";
import { useToast } from "../../hooks/useToast";

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
}) => {  const { isDarkMode } = useThemeDark();
  const { data: categories, isLoading: isLoadingCat } = useAssetCategory();
  const { data: models, isLoading: isLoadingModel } = useModel();
  const { data: fundingEntities } = useFundingEntity();

  // Hook del Toast (aunque en este componente ya no lo usaremos)
  const { /* showToast, */ message, type } = useToast();

  const [formData, setFormData] = useState<Partial<AssetType>>(initialAsset);
  const [isEditing, setIsEditing] = useState(false);
  // Cuando se abre el modal se carga la data inicial y se resetea el modo edición
  useEffect(() => {
    if (isOpen) {
      // Cargar la data inicial
      setFormData(initialAsset);
      setIsEditing(false);
  
      // Si hay un name_FundingEntity en el activo, buscamos el id_FundingEntity correspondiente
      if (initialAsset.name_FundingEntity && fundingEntities?.length) {
        const matched = fundingEntities.find((entity) => entity.name_FundingEntity === initialAsset.name_FundingEntity);
        if (matched) {
          // Lo guardamos en el formData para el select
          setFormData((prev) => ({
            ...prev,
            id_FundingEntity: matched.id_FundingEntity,
          }));
        }
      }
    }
  }, [isOpen, initialAsset, fundingEntities]);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!isEditing) return;
    const { name, value } = e.target;
  
    // Caso especial: si es "id_FundingEntity", busca el name_FundingEntity en la lista
    if (name === "id_FundingEntity") {
      const newId = parseInt(value, 10);
      const matchedEntity = fundingEntities?.find((entity) => entity.id_FundingEntity === newId);
  
      setFormData((prev) => ({
        ...prev,
        id_FundingEntity: isNaN(newId) ? undefined : newId,
        name_FundingEntity: matchedEntity?.name_FundingEntity ?? "",
      }));
    }
    // Otros campos numéricos
    else if (name === "idAssetCategory" || name === "idModel") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
    }
    // Campos de texto
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  // En esta función ya no llamamos a showToast
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
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => {
          setIsEditing(false);
          onClose();
        }}
        contentLabel="Editar activo"
        className="flex items-center justify-center min-h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      >
        <div
          className={`p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto ${
            isDarkMode ? "bg-gray-800 text-gray-500" : "bg-white text-gray-900"
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
                  Nombre del activo:
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
                  Número de serie:
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
                  Costo original:
                </span>
                <input
                  type="number"
                  name="originalCost"
                  value={formData.originalCost || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`${baseInputClass} ${!isEditing ? readOnlyClass : ""}`}
                />
              </label>              <label className="block">
                <span className="text-gray-700 dark:text-gray-300">
                  Entidad Financiadora:
                </span>
                {isEditing ? (
                  <select
                    name="id_FundingEntity"
                    value={formData.id_FundingEntity || ""}
                    onChange={handleInputChange}
                    className={baseInputClass}
                  >
                    <option value="">Seleccione una entidad financiadora</option>
                    {fundingEntities?.map((entity) => (
                      <option key={entity.id_FundingEntity} value={entity.id_FundingEntity}>
                        {entity.name_FundingEntity}
                      </option>
                    ))}
                  </select>
                ) : (
                  // Modo lectura
                  <input
                    type="text"
                    value={formData.name_FundingEntity || ""}
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
                  Fecha de compra:
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
      {/* Aunque aquí se renderice el Toast, ahora su llamado se realizará en el modal de confirmación */}
      <Toast message={message} type={type} />
    </>
  );
};

export default AssetEditModal;
