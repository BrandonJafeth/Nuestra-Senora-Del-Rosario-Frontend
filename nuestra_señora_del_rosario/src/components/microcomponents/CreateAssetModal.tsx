import React, { useState, useEffect } from "react";
import { useThemeDark } from "../../hooks/useThemeDark";
import { useFundingEntity } from "../../hooks/useFundingEntity";
import { useAssetCategory } from "../../hooks/useAssetCategory";
import { useModel } from "../../hooks/useModel";
import { AssetType } from "../../types/AssetType";
import { useCreateAsset } from "../../hooks/useCreaateAsset";
import { useToast } from "../../hooks/useToast";
import Toast from "../common/Toast";
import { useCheckAssetPlate } from "../../hooks/useCheckAssetPlate";

interface CreateAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Nueva prop para manejar el evento de éxito
}

const CreateAssetModal: React.FC<CreateAssetModalProps> = ({ 
  isOpen, 
  onClose,
  onSuccess 
}) => {  const { isDarkMode } = useThemeDark();
  const { mutate: createAsset, isLoading: isCreating } = useCreateAsset();
  const { data: fundingEntityOptions = [] } = useFundingEntity();
  const { data: categoryOptions = [] } = useAssetCategory();
  const { data: modelOptions = [] } = useModel();
  const { showToast, message, type } = useToast();
  // Estados para las validaciones
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isTypingPlate, setIsTypingPlate] = useState(false);

  // Definir estilos de inputs reutilizables
  const getInputClass = (fieldName: string) => {
    const hasError = formSubmitted && errors[fieldName];
    return `w-full p-2 border rounded-lg ${
      isDarkMode
        ? "bg-gray-700 border-gray-600 text-white"
        : "bg-white border-gray-300 text-black"
    } ${hasError ? 'border-red-500' : ''}`;
  };
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
    id_FundingEntity: 0,
    categoryName: "",
    modelName: "",
    brandName: "",
    name_FundingEntity: ""
  });
    // Verificación de placa duplicada
  const { data: plateCheck, isLoading: checkingPlate } = useCheckAssetPlate(newAsset.plate || '');
  
  // Efecto para limpiar el estado de escritura después de un tiempo
  useEffect(() => {
    if (isTypingPlate) {
      const timer = setTimeout(() => {
        setIsTypingPlate(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isTypingPlate]);

  // Efecto para actualizar errores basados en la verificación de placa
  useEffect(() => {
    if (plateCheck?.exists) {
      setErrors(prev => ({ ...prev, plate: `La placa '${newAsset.plate}' ya está registrada` }));
      setIsTypingPlate(false);
    } else if (plateCheck !== undefined && errors.plate?.includes('ya está registrada')) {
      const newErrors = {...errors};
      delete newErrors.plate;
      setErrors(newErrors);
    }
  }, [plateCheck, newAsset.plate, errors]);

  const validateField = (name: string, value: string | number): string => {
    switch (name) {
      case 'assetName':
        return !String(value).trim() ? 'El nombre del activo es obligatorio' : '';
      case 'serialNumber':
        return !String(value).trim() ? 'El número de serie es obligatorio' : '';
      case 'plate':
        if (!String(value).trim()) return 'La placa es obligatoria';
        if (plateCheck?.exists) return `La placa '${value}' ya está registrada`;
        return '';
      case 'purchaseDate':
        return !value ? 'La fecha de compra es obligatoria' : '';
      case 'location':
        return !String(value).trim() ? 'La ubicación es obligatoria' : '';
      case 'assetCondition':
        return !String(value).trim() ? 'La condición del activo es obligatoria' : '';      case 'idAssetCategory':
        return Number(value) === 0 ? 'Debe seleccionar una categoría' : '';
      case 'id_FundingEntity':
        return Number(value) === 0 ? 'Debe seleccionar una entidad financiadora' : '';
      default:
        return '';
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Si está editando la placa, activamos el estado de escritura
    if (name === 'plate') {
      setIsTypingPlate(true);
      // Si la placa está vacía, eliminamos el error relacionado
      if (!value.trim() && errors.plate?.includes('ya está registrada')) {
        const newErrors = {...errors};
        delete newErrors.plate;
        setErrors(newErrors);
      }
    }
    
    // Actualizar el valor del activo
    setNewAsset({
      ...newAsset,
      [name]: name === "originalCost" ? parseFloat(value) : value,
    });
    
    // Si ya se ha enviado el formulario, validamos el campo
    if (formSubmitted) {
      const errorMessage = validateField(name, value);
      if (errorMessage) {
        setErrors(prev => ({ ...prev, [name]: errorMessage }));
      } else {
        // Si no hay error, eliminamos el error previo si existía
        const newErrors = {...errors};
        delete newErrors[name];
        setErrors(newErrors);
      }
    }
  };
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
      // Validar cada campo
    Object.entries(newAsset).forEach(([key, value]) => {
      // Solo validamos los campos que nos interesan
      if (['assetName', 'serialNumber', 'plate', 'purchaseDate', 'location', 'assetCondition', 'idAssetCategory', 'id_FundingEntity'].includes(key)) {
        const errorMessage = validateField(key, value as string | number);
        if (errorMessage) {
          newErrors[key] = errorMessage;
          isValid = false;
        }
      }
    });
    
    // Verificar si hay error específico de placa duplicada
    if (plateCheck?.exists && newAsset.plate.trim() !== '') {
      newErrors.plate = `La placa '${newAsset.plate}' ya está registrada`;
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    setFormSubmitted(true);
    
    if (!validateForm()) {
      return;
    }
    
    // Si hay algún error no permitimos enviar el formulario
    if (Object.keys(errors).length > 0) {
      return;
    }

    createAsset(newAsset, {
      onSuccess: () => {        setNewAsset({
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
          id_FundingEntity: 0,
          categoryName: "",
          modelName: "",
          brandName: "",
          name_FundingEntity: "",
        });
        
        setFormSubmitted(false);
        setErrors({});
        showToast("Activo creado exitosamente.", "success");
        onClose();

        if (onSuccess) onSuccess();
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } } };
        const backendMessage = err?.response?.data?.message || "Ocurrió un error al crear el activo.";
        showToast(backendMessage, "error");
      },
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
              className={`${getInputClass('assetName')} mb-1`}
            />
            {errors.assetName && <p className="text-red-500 text-xs mb-3">{errors.assetName}</p>}
            
            <label className="block mb-2 font-semibold">Número de serie</label>
            <input
              type="text"
              name="serialNumber"
              value={newAsset.serialNumber}
              onChange={handleChange}
              className={`${getInputClass('serialNumber')} mb-1`}
            />
            {errors.serialNumber && <p className="text-red-500 text-xs mb-3">{errors.serialNumber}</p>}
            
            <label className="block mb-2 font-semibold">Placa</label>
            <div className="relative">
              <input
                type="text"
                name="plate"
                value={newAsset.plate}
                onChange={handleChange}
                className={`${getInputClass('plate')} mb-1`}              />
              {checkingPlate && (
                <div className="absolute right-2 top-2">
                  <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
            {errors.plate && <p className="text-red-500 text-xs mb-3">{errors.plate}</p>}
            
            <label className="block mb-2 font-semibold">Costo</label>
            <input
              type="number"
              name="originalCost"
              value={newAsset.originalCost}
              onChange={handleChange}
              className={`${getInputClass('originalCost')} mb-4`}
            />
             
            <label className="block mb-2 font-semibold">Fecha de compra</label>
            <input
              type="date"
              name="purchaseDate"
              value={newAsset.purchaseDate}
              onChange={handleChange}
              className={`${getInputClass('purchaseDate')} mb-1`}
            />
            {errors.purchaseDate && <p className="text-red-500 text-xs mb-3">{errors.purchaseDate}</p>}
          </div>
          
          {/* Columna 2 */}
          <div>
            <label className="block mb-2 font-semibold">Ubicación</label>
            <input
              type="text"
              name="location"
              value={newAsset.location}
              onChange={handleChange}
              className={`${getInputClass('location')} mb-1`}
            />
            {errors.location && <p className="text-red-500 text-xs mb-3">{errors.location}</p>}
            
            <label className="block mb-2 font-semibold">Condición del activo</label>
            <select
              name="assetCondition"
              value={newAsset.assetCondition}
              onChange={handleChange}
              className={`${getInputClass('assetCondition')} mb-1`}
            >
              <option value="">Seleccione la condición</option>
              <option value="Mal Estado">Mal estado</option>
              <option value="Buen Estado">Buen estado</option>
            </select>
            {errors.assetCondition && <p className="text-red-500 text-xs mb-3">{errors.assetCondition}</p>}
              <label className="block mb-2 font-semibold">Entidad Financiadora</label>
            <select
              name="id_FundingEntity"
              value={newAsset.id_FundingEntity}
              onChange={handleChange}
              className={`${getInputClass('id_FundingEntity')} mb-1`}
            >
              <option value={0}>Seleccione una Entidad Financiadora*</option>
              {fundingEntityOptions.map((entity) => (
                <option key={entity.id_FundingEntity} value={entity.id_FundingEntity}>
                  {entity.name_FundingEntity}
                </option>
              ))}
            </select>
            {errors.id_FundingEntity && <p className="text-red-500 text-xs mb-3">{errors.id_FundingEntity}</p>}
            
            <label className="block mb-2 font-semibold">Categoría</label>
            <select
              name="idAssetCategory"
              value={newAsset.idAssetCategory}
              onChange={handleChange}
              className={`${getInputClass('idAssetCategory')} mb-1`}
            >
              <option value={0}>Seleccione una categoría*</option>
              {categoryOptions.map((cat) => (
                <option key={cat.idAssetCategory} value={cat.idAssetCategory}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            {errors.idAssetCategory && <p className="text-red-500 text-xs mb-3">{errors.idAssetCategory}</p>}
            
            <label className="block mb-2 font-semibold">Modelo (opcional)</label>
            <select
              name="idModel"
              value={newAsset.idModel}
              onChange={handleChange}
              className={`${getInputClass('idModel')} mb-4`}
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
            className={`px-4 py-2 text-white rounded-lg ${
              isCreating || checkingPlate
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            onClick={handleSubmit}
            disabled={isCreating || checkingPlate}
          >
            {isCreating ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </div>
            ) : "Crear Activo"}
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={onClose}
            disabled={isCreating}
          >
            Cancelar
          </button>
        </div>
      </div>
      <Toast message={message} type={type} />
    </div>
  );
};

export default CreateAssetModal;
