import React, { useState } from "react";
import { useThemeDark } from "../../hooks/useThemeDark";
import { useLaw } from "../../hooks/useLaw";
import { useAssetCategory } from "../../hooks/useAssetCategory";
import { useModel } from "../../hooks/useModel";
import { AssetType } from "../../types/AssetType";
import { useCreateAsset } from "../../hooks/useCreaateAsset";

interface CreateAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Nueva prop para manejar el evento de éxito
}

const CreateAssetModal: React.FC<CreateAssetModalProps> = ({ 
  isOpen, 
  onClose,
  onSuccess 
}) => {
  const { isDarkMode } = useThemeDark();
  const { mutate: createAsset, isLoading: isCreating } = useCreateAsset();
  const { data: lawOptions = [] } = useLaw();
  const { data: categoryOptions = [] } = useAssetCategory();
  const { data: modelOptions = [] } = useModel();

  // Definir estilos de inputs reutilizables
  const inputClass = `w-full p-2 border rounded-lg ${
    isDarkMode
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-white border-gray-300 text-black"
  }`;

  const [newAsset, setNewAsset] = useState<AssetType>({
    idAsset: 0,
    assetName: "",
    serialNumber: "",
    plate: "",
    originalCost: 0,
    purchaseDate: "",
    location: "",
    assetCondition: "",
    idAssetCategory: 0,
    idModel: 0,
    idLaw: 0,
    categoryName: "",
    modelName: "",
    brandName: "",
    lawName: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewAsset({
      ...newAsset,
      [name]: name === "originalCost" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = () => {
    // Validar campos obligatorios
    if (
      !newAsset.assetName.trim() ||
      !newAsset.serialNumber.trim() ||
      !newAsset.plate.trim() ||
      !newAsset.purchaseDate ||
      !newAsset.location.trim() ||
      !newAsset.assetCondition.trim() ||
      Number(newAsset.idAssetCategory) === 0 ||
      Number(newAsset.idLaw) === 0
    ) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    createAsset(newAsset, {
      onSuccess: () => {
        // Limpiar el formulario
        setNewAsset({
          idAsset: 0,
          assetName: "",
          serialNumber: "",
          plate: "",
          originalCost: 0,
          purchaseDate: "",
          location: "",
          assetCondition: "",
          idAssetCategory: 0,
          idModel: 0,
          idLaw: 0,
          categoryName: "",
          modelName: "",
          brandName: "",
          lawName: ""
        });
        
        // Cerrar el modal
        onClose();
        
        // Llamar al callback de éxito si existe
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: (error) => {
        console.error("Error al crear el activo:", error);
        alert("Ocurrió un error al crear el activo. Por favor intenta nuevamente.");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`p-6 rounded-lg shadow-lg w-[600px] ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Crear Activo</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Columna 1 */}
          <div>
            <label className="block mb-2 font-semibold">Nombre del activo</label>
            <input
              type="text"
              name="assetName"
              value={newAsset.assetName}
              onChange={handleChange}
              className={`${inputClass} mb-4`}
            />
            <label className="block mb-2 font-semibold">Número de serie</label>
            <input
              type="text"
              name="serialNumber"
              value={newAsset.serialNumber}
              onChange={handleChange}
              className={`${inputClass} mb-4`}
            />
            <label className="block mb-2 font-semibold">Placa</label>
            <input
              type="text"
              name="plate"
              value={newAsset.plate}
              onChange={handleChange}
              className={`${inputClass} mb-4`}
            />
            <label className="block mb-2 font-semibold">Costo</label>
            <input
              type="number"
              name="originalCost"
              value={newAsset.originalCost}
              onChange={handleChange}
              className={`${inputClass} mb-4`}
            />
             <label className="block mb-2 font-semibold">Fecha de compra</label>
            <input
              type="date"
              name="purchaseDate"
              value={newAsset.purchaseDate}
              onChange={handleChange}
              className={`${inputClass} mb-4`}
            />
          </div>
          {/* Columna 2 */}
          <div>
           
            <label className="block mb-2 font-semibold">Ubicación</label>
            <input
              type="text"
              name="location"
              value={newAsset.location}
              onChange={handleChange}
              className={`${inputClass} mb-4`}
            />
            <label className="block mb-2 font-semibold">Condición del activo</label>
            <select
              name="assetCondition"
              value={newAsset.assetCondition}
              onChange={handleChange}
              className={`${inputClass} mb-4`}
            >
              <option value="">Seleccione la condición</option>
              <option value="Mal Estado">Mal estado</option>
              <option value="Buen Estado">Buen estado</option>
            </select>
            <label className="block mb-2 font-semibold">Ley</label>
            <select
              name="idLaw"
              value={newAsset.idLaw}
              onChange={handleChange}
              className={`${inputClass} mb-4`}
            >
              <option value={0}>Seleccione una Ley*</option>
              {lawOptions.map((law) => (
                <option key={law.idLaw} value={law.idLaw}>
                  {law.lawName}
                </option>
              ))}
            </select>
            <label className="block mb-2 font-semibold">Categoría</label>
            <select
              name="idAssetCategory"
              value={newAsset.idAssetCategory}
              onChange={handleChange}
              className={`${inputClass} mb-4`}
            >
              <option value={0}>Seleccione una categoría*</option>
              {categoryOptions.map((cat) => (
                <option key={cat.idAssetCategory} value={cat.idAssetCategory}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            <label className="block mb-2 font-semibold">Modelo (opcional)</label>
            <select
              name="idModel"
              value={newAsset.idModel}
              onChange={handleChange}
              className={`${inputClass} mb-4`}
            >
              <option value={0}>Seleccione un modelo (opcional)</option>
              {modelOptions.map((model) => (
                <option key={model.idModel} value={model.idModel}>
                  {model.modelName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleSubmit}
            disabled={isCreating}
          >
            Crear Activo
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

export default CreateAssetModal;