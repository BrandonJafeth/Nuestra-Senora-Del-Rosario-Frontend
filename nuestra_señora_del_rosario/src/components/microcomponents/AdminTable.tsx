import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Column {
  key: string;
  label: string;
}

interface AdminTableProps {
  title: string;
  columns: Column[];
  data: any[];
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
  skeletonRows?: number;
  isDarkMode: boolean;
  pageNumber: number;
  totalPages?: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

const AdminTable: React.FC<AdminTableProps> = ({
  title,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  isLoading,
  skeletonRows = 5,
  isDarkMode,
  pageNumber,
  totalPages,
  onNextPage,
  onPreviousPage,
}) => {
  return (
    <div className={`p-6 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} shadow-md rounded-lg`}>
      {/* 📌 Título y Botón en la Misma Fila */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">{title}</h3>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={onAdd}>
          Agregar Nuevo
        </button>
      </div>

      {/* 📌 Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent rounded-lg shadow-md">
          <thead className="min-w-full table-auto">
            <tr className={`${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"} text-center`}>
              {columns.map((col) => (
                <th key={col.key} className="p-4">
                  {col.label}
                </th>
              ))}
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {isLoading ? (
              [...Array(skeletonRows)].map((_, i) => (
                <tr key={i}>
                  {columns.map((_, j) => (
                    <td key={j} className="p-4">
                      <Skeleton height={20} width="80%" />
                    </td>
                  ))}
                  <td className="p-4">
                    <Skeleton height={20} width="60px" />
                  </td>
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className={`${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}>
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 border border-gray-300">
                      {item[col.key]}
                    </td>
                  ))}
                  <td className="p-4 flex justify-center space-x-2 border border-gray-300">
                    <button
                      className="px-3 py-1 bg-orange-400 text-white rounded-lg hover:bg-orange-500"
                      onClick={() => onEdit(item)}
                    >
                      Editar
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      onClick={() => onDelete(item.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-4 text-gray-500">
                  No hay datos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📌 Controles de paginación */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={onPreviousPage}
          disabled={pageNumber === 1}
          className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <FaArrowLeft />
        </button>

        <span className={`${isDarkMode ? "text-white" : "text-gray-800"}`}>
          Página {pageNumber} de {totalPages}
        </span>

        <button
          onClick={onNextPage}
          disabled={pageNumber === totalPages}
          className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default AdminTable;
