import React, { useState, useEffect, useMemo } from "react";
import { FaFilter, FaTimesCircle } from "react-icons/fa";
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
import { useFilterAssets } from "../../hooks/useFilterAssets";
import { AssetFilterDTO } from "../../services/AssetService";
import SearchInput from "../common/SearchInput";
import ReusableTableRequests from "../microcomponents/ReusableTableRequests";

const AssetTable: React.FC = () => {
  const { isDarkMode } = useThemeDark();
  const queryClient = useQueryClient();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Cambiado de 6 a 5 para evitar problemas de paginación

  // Estado para el filtro local
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  
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
  
  // Hook para filtrar activos por nombre
  const { 
    assets: filteredAssets, 
    totalRecords: filteredTotalRecords, 
    loading: filterLoading,
    error: filterError,
    filterAssets
  } = useFilterAssets();

  // Determinar qué query usar basado en los filtros activos
  let activeQuery;
  if (isFiltering) {
    // No usamos ninguna query normal cuando estamos filtrando por nombre
    activeQuery = {
      data: { 
        data: filteredAssets,  // Usamos directamente los activos filtrados
        totalRecords: filteredTotalRecords 
      },
      isLoading: filterLoading,
      error: filterError
    };
  } else if (selectedCategory !== undefined) {
    activeQuery = categoryFilteredQuery;
  } else if (selectedCondition !== undefined) {
    activeQuery = conditionFilteredQuery;
  } else {
    activeQuery = normalAssetsQuery;
  }

  const { data, isLoading, error } = activeQuery;

  // Reset pageNumber cuando cambia el pageSize o cuando se cambia el filtro
  useEffect(() => {
    setPageNumber(1);
  }, [pageSize, selectedCategory, selectedCondition]);

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

  // Efecto para manejar la búsqueda con debounce
  useEffect(() => {
    // Este console.log ayuda a verificar cuándo se activa este efecto
    console.log('Búsqueda debounce en efecto:', searchTerm);

    // Solo activamos el filtrado cuando el usuario deja de escribir
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        // Si hay texto de búsqueda, activamos el filtrado
        setIsFiltering(true);
        
        // Desactivar otros filtros cuando usamos la búsqueda por nombre
        setSelectedCategory(undefined);
        setSelectedCondition(undefined);
        
        const filter: AssetFilterDTO = {
          assetName: searchTerm.trim()
        };
        
        console.log('Enviando filtro:', filter);
        // Ejecutamos la búsqueda con el filtro
        filterAssets(filter, pageNumber, pageSize);
      } else {
        // Si no hay texto, desactivamos el filtrado
        setIsFiltering(false);
      }
    }, 600); // Aumentamos el debounce a 600ms para dar más tiempo entre pulsaciones

    // Limpieza del timeout para evitar ejecuciones múltiples
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pageSize]); // Mantenemos solo searchTerm y pageSize como dependencias

  // Efecto separado para la paginación cuando está en modo filtrado
  useEffect(() => {
    if (isFiltering && searchTerm.trim()) {
      const filter: AssetFilterDTO = {
        assetName: searchTerm.trim()
      };
      
      filterAssets(filter, pageNumber, pageSize);
    }
    // Solo se ejecuta cuando cambia la página y estamos en modo filtrado
  }, [pageNumber, isFiltering, searchTerm, pageSize]);

  // Datos a mostrar
  const assetsToDisplay = useMemo(() => {
    console.log("Calculando assetsToDisplay", {
      isFiltering,
      filteredAssets,
      filteredAssetsLength: filteredAssets?.length,
      data
    });
    
    if (isFiltering) {
      return filteredAssets || [];
    } else if (data) {
      // Para queries normales
      if (Array.isArray(data)) {
        return data;
      } 
      return data.data || [];
    }
    return [];
  }, [isFiltering, filteredAssets, data]);

  // Total de páginas
  const totalPages = useMemo(() => {
    if (isFiltering) {

      return Math.max(1, Math.ceil(filteredTotalRecords / pageSize));
    } else if (data) {

      const total = data.totalRecords || (Array.isArray(data) ? data.length : 0);
      return Math.max(1, Math.ceil(total / pageSize));
    }
    return 1;
  }, [isFiltering, filteredTotalRecords, data, pageSize]);

  // Opciones para el selector de tamaño de página
  const pageSizeOptions = [5, 10, 15, 20];

  const resetFilters = () => {
    setSelectedCategory(undefined);
    setSelectedCondition(undefined);
    setSearchTerm("");
    setIsFiltering(false);
    setPageNumber(1);
  };

  // Función para manejar el cierre del modal de creación de activo y actualizar la tabla
  const handleCreateModalClose = (created: boolean = false) => {
    setIsCreateModalOpen(false);
    if (created) {
      // Mostrar mensaje de éxito
      showToast("Activo creado exitosamente", "success");
      
      // Invalidar las consultas para forzar una recarga de datos
      queryClient.invalidateQueries("assets");
      queryClient.invalidateQueries(["assetsByCategory"]);
      queryClient.invalidateQueries(["assetsByCondition"]);
    }
  };

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
      
      // Invalidar consultas para actualizar datos
      queryClient.invalidateQueries("assets");
      queryClient.invalidateQueries(["assetsByCategory"]);
      queryClient.invalidateQueries(["assetsByCondition"]);
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

  // Función para manejar el cambio de tamaño de página
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    // Resetear a la primera página cuando cambia el tamaño
    setPageNumber(1);
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
          Agregar activo
        </button>
        <h2 className={`text-3xl font-bold font-poppins ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          Lista de activos
        </h2>
        <AssetReportButton assets={assetsToDisplay} />
      </div>

      {/* Búsqueda por nombre usando SearchInput - Centrado */}
      <div className="flex justify-center w-full mb-6">
        <div className="w-full max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nombre de activo"
            isDarkMode={isDarkMode}
            className="w-full"
          />
        </div>
      </div>

      {/* Filtros: Estado y Categoría (visibles solo cuando no hay búsqueda activa) */}
      {!isFiltering && (
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-around mt-4">
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
              <option value="Buen Estado">Buen estado</option>
              <option value="Mal Estado">Mal estado</option>
            </select>
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

          {/* Selector de tamaño de página */}
          <div className="w-auto">
            <div className="flex items-center">
              <span className={`mr-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                Mostrar:
              </span>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className={`p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "bg-gray-700 text-white focus:ring-blue-400"
                    : "bg-white text-gray-700 focus:ring-blue-600"
                }`}
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>
                    {size} 
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón para limpiar filtros - solo visible si hay algún filtro activo */}
          {(selectedCategory !== undefined || selectedCondition !== undefined) && (
            <button
              onClick={resetFilters}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <FaTimesCircle className="mr-2" /> Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Indicador de filtros activos */}
      {(selectedCategory !== undefined || selectedCondition !== undefined || isFiltering) && (
        <div className={`mb-4 p-2 rounded-lg text-center ${isDarkMode ? "bg-gray-700 text-white" : "bg-blue-100 text-blue-800"}`}>
          <FaFilter className="inline mr-2" />
          Filtrando por: 
          {isFiltering && (
            <span className="font-bold mx-1">
              Nombre: {searchTerm}
            </span>
          )}
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
      <ReusableTableRequests<any>
        data={assetsToDisplay}
        headers={['Nombre', 'Número de serie', 'Costo original', 'Ubicación', 'Condición', 'Acciones']}
        isLoading={isLoading}
        skeletonRows={5}
        isDarkMode={isDarkMode}
        pageNumber={pageNumber}
        totalPages={totalPages}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        renderRow={renderAssetRow}
        emptyMessage={isFiltering ? `No se encontraron activos que coincidan con "${searchTerm}"` : "No hay activos disponibles"}
      />


      {/* Modales */}
      <CreateAssetModal
        isOpen={isCreateModalOpen}
        onClose={() => handleCreateModalClose(false)}
        onSuccess={() => handleCreateModalClose(true)}
      />

      {assetToEdit && (
        <AssetEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialAsset={assetToEdit}
          onDraftSave={handleDraftSave}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={handleCancelUpdate}
        onConfirm={handleConfirmUpdate}
        title="Confirmar Edición"
        message="¿Seguro que deseas actualizar los datos de este activo?"
        confirmText="Confirmar"
      />

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
