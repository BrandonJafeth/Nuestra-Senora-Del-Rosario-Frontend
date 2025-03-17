import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useThemeDark } from "../../hooks/useThemeDark";
import { useAssets } from "../../hooks/useAssets";

const AssetTable: React.FC = () => {
  // Hook para detectar el modo oscuro
  const { isDarkMode } = useThemeDark();

  // Paginación
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  // Consumiendo el hook de activos
  const { data, isLoading, error } = useAssets(pageNumber, pageSize);

  // Si está cargando
  if (isLoading) {
    return (
      <div className="overflow-x-auto px-4 sm:px-2">
        <table className="min-w-full bg-white dark:bg-[#0D313F] border border-gray-300 dark:border-gray-600 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
              <th className="py-2 px-4 border dark:border-gray-500">Nombre</th>
              <th className="py-2 px-4 border dark:border-gray-500">Número de Serie</th>
              <th className="py-2 px-4 border dark:border-gray-500">Placa</th>
              <th className="py-2 px-4 border dark:border-gray-500">Costo Original</th>
              <th className="py-2 px-4 border dark:border-gray-500">Ubicación</th>
              <th className="py-2 px-4 border dark:border-gray-500">Condición</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-4 border dark:border-gray-500">
                  <Skeleton width={100} />
                </td>
                <td className="py-2 px-4 border dark:border-gray-500">
                  <Skeleton width={100} />
                </td>
                <td className="py-2 px-4 border dark:border-gray-500">
                  <Skeleton width={60} />
                </td>
                <td className="py-2 px-4 border dark:border-gray-500">
                  <Skeleton width={80} />
                </td>
                <td className="py-2 px-4 border dark:border-gray-500">
                  <Skeleton width={80} />
                </td>
                <td className="py-2 px-4 border dark:border-gray-500">
                  <Skeleton width={80} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Manejo de errores
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

  // La respuesta puede traer un array de activos en data.data, o simplemente data
  // Ajusta según tu API. Aquí asumo data es un objeto con data: AssetType[]
  // Si tu API retorna un array plano, usa const assets = Array.isArray(data) ? data : [];
  const assets = Array.isArray(data) ? data : [];

  if (assets.length === 0) {
    return (
      <p className={`px-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        No hay activos disponibles.
      </p>
    );
  }

  // Render de cada fila
  const renderAssetRow = (asset: any) => (
    <tr
      key={asset.idAsset}
      className={`${
        isDarkMode
          ? "bg-gray-600 text-white hover:bg-gray-700"
          : "bg-white text-gray-800 hover:bg-gray-200"
      } transition-colors`}
    >
      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">{asset.assetName}</td>
      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">{asset.serialNumber}</td>
      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">{asset.plate}</td>
      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">{asset.originalCost}</td>
      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">{asset.location}</td>
      <td className="py-2 px-4 border border-gray-300 dark:border-gray-500">
        {asset.assetCondition}
      </td>
    </tr>
  );

  // Funciones de paginación
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
      {/* Título */}
      <h2
        className={`text-3xl font-bold mb-6 text-center font-poppins ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Lista de Activos
      </h2>

      {/* Tabla */}
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
    </div>
  );
};

export default AssetTable;
