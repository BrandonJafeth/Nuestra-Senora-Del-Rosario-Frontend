import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "react-loading-skeleton/dist/skeleton.css";

import { useThemeDark } from "../../hooks/useThemeDark";
import { useAssets } from "../../hooks/useAssets";
import { AssetType } from "../../types/AssetType";
import { useManageAsset } from "../../hooks/useManagmentAsset";
import AssetEditModal from "../microcomponents/AssetEditModal";
import ConfirmationModal from "../microcomponents/ConfirmationModal";
import { useToggleAssetCondition } from "../../hooks/useToggleAssetCondition";
import CreateAssetModal from "../microcomponents/CreateAssetModal";
import Toast from "../common/Toast";
import { useToast } from "../../hooks/useToast";

const AssetTable: React.FC = () => {
  const { isDarkMode } = useThemeDark();
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  // Modal de creación de activo
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {message, type, showToast} = useToast ();

  // Modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<AssetType | null>(null);

  // Modal de confirmación para la edición
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingEditData, setPendingEditData] = useState<Partial<AssetType>>({});

  // Hook para actualizar un activo (PUT)
  const { handleUpdateAsset } = useManageAsset();

  // Hook para cambiar la condición (PATCH)
  const { handleToggleCondition } = useToggleAssetCondition();

  // Modal de confirmación para toggle condition
  const [isConfirmToggleOpen, setIsConfirmToggleOpen] = useState(false);
  const [assetToToggle, setAssetToToggle] = useState<AssetType | null>(null);

  // Datos
  const { data, isLoading, error } = useAssets(pageNumber, pageSize);

  if (isLoading) {
    return (
      <div className="overflow-x-auto px-4 sm:px-2">
        {/* ... tabla con Skeleton ... */}
      </div>
    );
  }

  if (error) {
    return (
      <p className={`px-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        Error al cargar los activos.
      </p>
    );
  }

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

  /** Abre el modal de edición con datos del activo */
  const handleEdit = (asset: AssetType) => {
    setAssetToEdit(asset);
    setIsEditModalOpen(true);
  };

  /** Recibe el borrador de cambios desde el modal de edición */
  const handleDraftSave = (draftData: Partial<AssetType>) => {
    setPendingEditData(draftData);
    setIsConfirmOpen(true);
  };

  /** El usuario confirma la actualización (edición) */
  const handleConfirmUpdate = async () => {
    try {
      if (assetToEdit) {
        await handleUpdateAsset(assetToEdit.idAsset, pendingEditData);
      }
      showToast("Se ha editado el activo con éxito", "success");
    } catch (error) {
      showToast("Error al editar el activo", "error");
    }
    setIsConfirmOpen(false);
    setAssetToEdit(null);
    setPendingEditData({});
  };

  /** El usuario cancela la confirmación (edición) */
  const handleCancelUpdate = () => {
    setIsConfirmOpen(false);
  };

  /** Inicia el proceso de cambiar estado (toggle-condition) */
  const handleStateChange = (asset: AssetType) => {
    setAssetToToggle(asset);
    setIsConfirmToggleOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!assetToToggle) return;
    try {
      await handleToggleCondition(assetToToggle.idAsset);
      showToast("Condición del activo cambiada con éxito", "success");
    } catch (error) {
      showToast("Error al cambiar la condición del activo", "error");
    }
    setIsConfirmToggleOpen(false);
    setAssetToToggle(null);
  };

  /** El usuario cancela el toggle-condition */
  const handleCancelToggle = () => {
    setIsConfirmToggleOpen(false);
    setAssetToToggle(null);
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
        {asset.originalCost}
      </td>
      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
        {asset.location}
      </td>
      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
        {asset.assetCondition}
      </td>
      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500 space-y-2">
        <button
          onClick={() => handleEdit(asset)}
          className="px-4 py-2 mr-2 mb-2 sm:mb-0 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-200"
        >
          Detalles
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
      {/* Botón Agregar Activo - ubicado en la parte superior izquierda */}
      <div className="flex justify-start ml-4 mt-2">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Agregar Activo
        </button>
      </div>

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

      {/* Paginación */}
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

      {/* Modal de Creación de Activo */}
      <CreateAssetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Modal de Edición */}
      {assetToEdit && (
        <AssetEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialAsset={assetToEdit}
          onDraftSave={handleDraftSave}
        />
      )}

      {/* Modal de Confirmación (Edición) */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={handleCancelUpdate}
        onConfirm={handleConfirmUpdate}
        title="Confirmar Edición"
        message="¿Seguro que deseas actualizar los datos de este activo?"
        confirmText="Confirmar"
      />

      {/* Modal de Confirmación (Toggle Condition) */}
      <ConfirmationModal
        isOpen={isConfirmToggleOpen}
        onClose={handleCancelToggle}
        onConfirm={handleConfirmToggle}
        title="Cambiar Estado"
        message="¿Seguro que deseas cambiar la condición de este activo?"
        confirmText="Confirmar"
      />

      <Toast message={message} type={type} />
    </div>
  );
};

export default AssetTable;