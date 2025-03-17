import React, { useState, useEffect } from "react";
import { useThemeDark } from "../../hooks/useThemeDark"; // Asegúrate de que la ruta sea la correcta

interface AdminModalEditWithBrandProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSave: (updatedModelName: string, updatedIdBrand: number) => void;
  initialModelName: string;
  initialIdBrand: number;
  brands: { idBrand: number; brandName: string }[];
}

const AdminModalEditWithBrand: React.FC<AdminModalEditWithBrandProps> = ({
  isOpen,
  title,
  onClose,
  onSave,
  initialModelName,
  initialIdBrand,
  brands,
}) => {
  const { isDarkMode } = useThemeDark();
  const [updatedModelName, setUpdatedModelName] = useState(initialModelName);
  const [updatedIdBrand, setUpdatedIdBrand] = useState(initialIdBrand);

  useEffect(() => {
    if (isOpen) {
      setUpdatedModelName(initialModelName);
      setUpdatedIdBrand(initialIdBrand);
    }
  }, [isOpen, initialModelName, initialIdBrand]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`p-6 rounded-lg shadow-lg w-96 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        <h2
          className={`text-xl font-bold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h2>
        <input
          type="text"
          value={updatedModelName}
          onChange={(e) => setUpdatedModelName(e.target.value)}
          placeholder="Editar nombre"
          className={`w-full p-2 border rounded-lg mb-4 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
        />
        <select
          value={updatedIdBrand}
          onChange={(e) => setUpdatedIdBrand(parseInt(e.target.value))}
          className={`w-full p-2 border rounded-lg mb-4 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
        >
          {brands.map((brand) => (
            <option key={brand.idBrand} value={brand.idBrand}>
              {brand.brandName}
            </option>
          ))}
        </select>
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => onSave(updatedModelName, updatedIdBrand)}
          >
            Confirmar
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

export default AdminModalEditWithBrand;
