import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaFilter, FaTimesCircle, FaSearch } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useQueryClient } from "react-query";

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
import { useAssetCategory } from "../../hooks/useAssetCategory";
import useAssetsByCategory from "../../hooks/useAssetsByCategory";
import useAssetsByCondition from "../../hooks/useAssetsByCondition";

const AssetTable: React.FC = () => {
  const { isDarkMode } = useThemeDark();
  const queryClient = useQueryClient();
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 6; // Máximo 6 activos por página

  // Estado para filtrar activos por nombre
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados para filtros de categoría y condición
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [selectedCondition, setSelectedCondition] = useState<string | undefined>(undefined);

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

  // Obtener categorías para el filtro
  const { data: categoriesData, isLoading: isCategoriesLoading } = useAssetCategory();

  // Obtención de datos de activos según los filtros aplicados
  const normalAssetsQuery = useAssets(pageNumber, pageSize);
  const categoryFilteredQuery = useAssetsByCategory(selectedCategory, pageNumber, pageSize);
  const conditionFilteredQuery = useAssetsByCondition(selectedCondition || "", pageNumber, pageSize);
  
  // Determinar qué query usar basado en los filtros activos
  let activeQuery;
  if (selectedCategory !== undefined) {
    activeQuery = categoryFilteredQuery;
  } else if (selectedCondition !== undefined) {
    activeQuery = conditionFilteredQuery;
  } else {
    activeQuery = normalAssetsQuery;
  }

  const { data, isLoading, error } = activeQuery;

  const resetFilters = () => {
    setSelectedCategory(undefined);
    setSelectedCondition(undefined);
    setPageNumber(1);
  };

  // Componente de esqueleto para la tabla mientras carga
  const TableSkeleton = () => (
    <div className={`relative w-full max-w-[1169px] mx-auto px-4 py-6 sm:px-2 sm:py-4 ${
      isDarkMode ? "bg-[#0D313F]" : "bg-white"
    } rounded-[30px] shadow-2xl`}>
      <div className="flex flex-col sm:flex-row sm:justify-between mr-5 ml-5 mt-2 sm:items-center mb-4">
        <Skeleton width={150} height={40} />
        <Skeleton width={200} height={40} />
        <Skeleton width={150} height={40} />
      </div>
      
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-around">
        <Skeleton width={120} height={46} />
        <Skeleton width={300} height={46} />
        <Skeleton width={120} height={46} />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent">
          <thead>
            <tr>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <th key={item} className="p-4">
                  <Skeleton height={30} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6].map((row) => (
              <tr key={row}>
                {[1, 2, 3, 4, 5, 6].map((col) => (
                  <td key={`${row}-${col}`} className="py-4 px-2">
                    <Skeleton height={25} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-center items-center mt-6 space-x-4">
        <Skeleton width={40} height={40} circle />
        <Skeleton width={100} height={25} />
        <Skeleton width={40} height={40} circle />
      </div>
    </div>
  );

  if (isLoading) {
    return <TableSkeleton />;
  }
  if (error) {
    return (
      <p className={`px-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        Error al cargar los activos.
      </p>
    );
  }

  // Extraer datos de la respuesta según el formato
  const totalRecords = data?.totalRecords || 0;
  const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / pageSize) : 1;
  const assets: AssetType[] = Array.isArray(data) ? data : (data?.data || []);

  // Filtrado adicional por término de búsqueda dentro de los resultados ya filtrados por categoría/condición
  const filteredAssets = assets.filter((asset) =>
    asset.assetName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modificamos esta parte para que no retorne un componente diferente cuando no hay resultados
  // Simplemente marcaremos una variable para usar dentro del JSX principal
  const noResults = filteredAssets.length === 0;

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
      
      // Invalidar todas las queries relacionadas con activos para forzar su actualización
      queryClient.invalidateQueries("assets");
      queryClient.invalidateQueries(["assetsByCategory"]);
      queryClient.invalidateQueries(["assetsByCondition"]);
      
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

      {/* Filtros: Estado, Búsqueda y Categoría */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-around">
        {/* Filtro por estado */}
        <div className="w-auto">
          <select
            value={selectedCondition === undefined ? "" : selectedCondition}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCondition(value === "" ? undefined : value);
              setSelectedCategory(undefined); // Limpiar el otro filtro
              setPageNumber(1); // Reset a primera página
            }}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
              isDarkMode
                ? "bg-gray-700 text-white focus:ring-blue-400"
                : "bg-white text-gray-700 focus:ring-blue-600"
            }`}
          >
            <option value="">Todos los estados</option>
            <option value="Buen Estado">Buen Estado</option>
            <option value="Mal Estado">Mal Estado</option>
          </select>
        </div>

        {/* Búsqueda por nombre */}
        <div className="w-3/6">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
              isDarkMode
                ? "bg-gray-700 text-white focus:ring-blue-400"
                : "bg-white text-gray-700 focus:ring-blue-600"
            }`}
          />
        </div>

        {/* Filtro por categoría */}
        <div className="w-auto">
          <select
            value={selectedCategory === undefined ? "" : selectedCategory}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCategory(value === "" ? undefined : Number(value));
              setSelectedCondition(undefined); // Limpiar el otro filtro
              setPageNumber(1); // Reset a primera página
            }}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
              isDarkMode
                ? "bg-gray-700 text-white focus:ring-blue-400"
                : "bg-white text-gray-700 focus:ring-blue-600"
            }`}
          >
            <option value="">Todas las categorías</option>
            {!isCategoriesLoading && categoriesData?.map(category => (
              <option key={category.idAssetCategory} value={category.idAssetCategory}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Botón para limpiar filtros */}
        {(selectedCategory !== undefined || selectedCondition !== undefined) && (
          <button
            onClick={resetFilters}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <FaTimesCircle className="mr-2" /> Limpiar filtros
          </button>
        )}
      </div>

      {/* Indicador de filtros activos */}
      {(selectedCategory !== undefined || selectedCondition !== undefined) && (
        <div className={`mb-4 p-2 rounded-lg text-center ${isDarkMode ? "bg-gray-700 text-white" : "bg-blue-100 text-blue-800"}`}>
          <FaFilter className="inline mr-2" />
          Filtrando por: 
          {selectedCategory !== undefined && !isCategoriesLoading && (
            <span className="font-bold mx-1">
              Categoría: {categoriesData?.find(c => c.idAssetCategory === selectedCategory)?.categoryName || 'Desconocida'}
            </span>
          )}
          {selectedCondition !== undefined && (
            <span className="font-bold mx-1">
              Estado: {selectedCondition === 'Buen Estado' ? 'Buen estado' : 'Mal estado'}
            </span>
          )}
        </div>
      )}

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
            {noResults ? (
              <tr>
                <td colSpan={6} className="py-8">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FaSearch className={`text-4xl ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <p className={`text-lg ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      No se encontraron activos
                    </p>
                    {(selectedCategory !== undefined || selectedCondition !== undefined) && (
                      <button 
                        onClick={resetFilters} 
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredAssets.map(renderAssetRow)
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación - solo mostrar si hay resultados */}
      {!noResults && (
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
      )}

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
