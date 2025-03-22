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
import AssetReportButton from "../microcomponents/AssetReportButton";

const AssetTable: React.FC = () => {
  const { isDarkMode } = useThemeDark();
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 6; // Máximo 6 activos por página

  // Estado para filtrar activos por nombre (puedes extenderlo a otros campos)
  const [searchTerm, setSearchTerm] = useState("");

  // Modal de creación, edición, etc.
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { message, type, showToast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<AssetType | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingEditData, setPendingEditData] = useState<Partial<AssetType>>({});

  const { handleUpdateAsset } = useManageAsset();
  const { handleToggleCondition } = useToggleAssetCondition();
  const [isConfirmToggleOpen, setIsConfirmToggleOpen] = useState(false);
  const [assetToToggle, setAssetToToggle] = useState<AssetType | null>(null);

  // Obtención de datos de activos
  const { data, isLoading, error } = useAssets(pageNumber, pageSize);

  if (isLoading) {
    return (
      <div className="overflow-x-auto px-4 sm:px-2">
        {/* Aquí podrías poner un Skeleton o mensaje de carga */}
        <p>Cargando activos...</p>
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

  // Asumimos que el hook useAssets devuelve un objeto con totalRecords, totalPages y los activos en una propiedad (por ejemplo, assets)
  const totalRecords = data?.totalRecords || 0;
  const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / pageSize) : 1;
  // Aquí asumimos que los activos están en data.assets; si data es directamente el array, ajusta en consecuencia:
  const assets: AssetType[] = Array.isArray(data) ? data : [];

  // Filtrado de activos (en la página actual) por searchTerm (por nombre)
  const filteredAssets = assets.filter((asset) =>
    asset.assetName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (assets.length === 0) {
    return (
      <p className={`px-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        No hay activos disponibles.
      </p>
    );
  }

  // Handlers para modales y edición
  const handleEdit = (asset: AssetType) => {
    setAssetToEdit(asset);
    setIsEditModalOpen(true);
  };

  const handleDraftSave = (draftData: Partial<AssetType>) => {
    setPendingEditData(draftData);
    setIsConfirmOpen(true);
  };

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

  const handleCancelUpdate = () => {
    setIsConfirmOpen(false);
  };

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

  const handleCancelToggle = () => {
    setIsConfirmToggleOpen(false);
    setAssetToToggle(null);
  };

  // Render de cada fila en la tabla
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
      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500 space-y-2 space-x-2">
        <button
          onClick={() => handleEdit(asset)}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-200"
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

  // Handlers de paginación
  const handlePreviousPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) setPageNumber(pageNumber + 1);
  };

  return (
    <div
      className={`relative w-full max-w-[1169px] mx-auto px-4 py-6 sm:px-2 sm:py-4 ${
        isDarkMode ? "bg-[#0D313F]" : "bg-white"
      } rounded-[20px] shadow-2xl`}
    >
       {/* Fila superior: Título y Botón */}
  <div className="flex flex-col sm:flex-row sm:justify-between mr-5 ml-5 mt-2 sm:items-center mb-4">
    <button
      onClick={() => setIsCreateModalOpen(true)}
      className="mt-2 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
    >
      Agregar Activo
    </button>
    <h2 className={`text-3xl font-bold font-poppins ${isDarkMode ? "text-white" : "text-gray-800"}`}>
      Lista de Activos
    </h2>
    <AssetReportButton assets={assets} />
  </div>

  {/* Filtro debajo de la fila superior */}
  <div className="mb-4 flex justify-center">
    <input
      type="text"
      placeholder="Buscar por nombre"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className={`w-full max-w-md p-3 border rounded-lg focus:outline-none focus:ring-2 ${
        isDarkMode
          ? "bg-gray-700 text-white focus:ring-blue-400"
          : "bg-white text-gray-700 focus:ring-blue-600"
      }`}
    />
  </div>

      {/* Tabla de activos */}
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
            {filteredAssets.map(renderAssetRow)}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
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
