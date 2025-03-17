// components/AssetTable.tsx
import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "react-loading-skeleton/dist/skeleton.css";

import { useThemeDark } from "../../hooks/useThemeDark";
import { useAssets } from "../../hooks/useAssets";
import { AssetType } from "../../types/AssetType";
import { useManageAsset } from "../../hooks/useManagmentAsset";
import AssetEditModal from "../microcomponents/AssetEditModal";


const AssetTable: React.FC = () => {
  const { isDarkMode } = useThemeDark();
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  // Para abrir/cerrar el modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<AssetType | null>(null);

  // Consumiendo el hook de activos
  const { data, isLoading, error } = useAssets(pageNumber, pageSize);

  // Hook para manejar la mutación PUT
  const { handleUpdateAsset } = useManageAsset();

  // Cargando
  if (isLoading) {
    return (
      <div className="overflow-x-auto px-4 sm:px-2">
        {/* Tabla con skeleton... */}
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <p className={`px-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        Error al cargar los activos.
      </p>
    );
  }

  // Datos
  const totalRecords = data?.totalRecords || 0;
  const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / pageSize) : 1;
  const assets = Array.isArray(data) ? data : [];

  if (assets.length === 0) {
    return (
      <p className={`px-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        No hay activos disponibles.
      </p>
    );
  }

  /** Abre el modal de edición con los datos del activo */
  const handleEdit = (asset: AssetType) => {
    setAssetToEdit(asset);
    setIsEditModalOpen(true);
  };

  /** Lógica para actualizar el activo */
  const handleSaveChanges = (updatedAsset: Partial<AssetType>) => {
    if (!assetToEdit) return;
    // Llamamos a la mutación PUT
    handleUpdateAsset(assetToEdit.idAsset, updatedAsset);
    // Cerramos el modal
    setIsEditModalOpen(false);
  };

  /** Cambiar estado (ejemplo) */
  const handleStateChange = (asset: AssetType) => {
    console.log("Cambiar estado del activo:", asset);
    // Tu lógica de estado
  };

  // Render fila
  const renderAssetRow = (asset: AssetType) => (
    <tr
      key={asset.idAsset}
      className={`${
        isDarkMode
          ? "bg-gray-600 text-white hover:bg-gray-700"
          : "bg-white text-gray-800 hover:bg-gray-200"
      } transition-colors`}
    >
      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
        {asset.assetName}
      </td>
      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
        {asset.serialNumber}
      </td>
      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
        {asset.plate}
      </td>
      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
        {asset.originalCost}
      </td>
      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
        {asset.location}
      </td>
      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
        {asset.assetCondition}
      </td>
      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
        <button
          onClick={() => handleEdit(asset)}
          className="px-4 py-2 mr-2 mb-2 sm:mb-0 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition duration-200"
        >
          Editar
        </button>
        <button
          onClick={() => handleStateChange(asset)}
          className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition duration-200"
        >
          Estado
        </button>
      </td>
    </tr>
  );

  // Paginación
  const handlePreviousPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) setPageNumber(pageNumber + 1);
  };

  return (
    <div
      className={`
        relative w-full max-w-[1169px] mx-auto px-4 py-6 sm:px-2 sm:py-4
        ${isDarkMode ? "bg-[#0D313F]" : "bg-white"} 
        rounded-[20px] shadow-2xl
      `}
    >
      <h2
        className={`text-3xl font-bold mb-6 text-center font-poppins ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Lista de Activos
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent rounded-lg shadow-md">
          <thead>
            <tr
              className={`${
                isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
              } text-center`}
            >
              <th className="p-4 border dark:border-gray-500">Nombre</th>
              <th className="p-4 border dark:border-gray-500">Número de Serie</th>
              <th className="p-4 border dark:border-gray-500">Placa</th>
              <th className="p-4 border dark:border-gray-500">Costo Original</th>
              <th className="p-4 border dark:border-gray-500">Ubicación</th>
              <th className="p-4 border dark:border-gray-500">Condición</th>
              <th className="p-4 border dark:border-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {assets.map(renderAssetRow)}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={pageNumber === 1}
          className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <FaArrowLeft />
        </button>

        <span className={`${isDarkMode ? "text-white" : "text-gray-800"}`}>
          Página {pageNumber} de {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={pageNumber === totalPages}
          className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Modal de Edición */}
      {assetToEdit && (
        <AssetEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialAsset={assetToEdit}
          onSave={handleSaveChanges}
        />
      )}
    </div>
  );
};

export default AssetTable;
