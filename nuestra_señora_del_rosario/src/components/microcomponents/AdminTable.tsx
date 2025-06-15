import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import { useThemeDark } from "../../hooks/useThemeDark"; // Importamos el hook de modo oscuro

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
  pageNumber: number;
  totalPages?: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  itemsPerPage: number;
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
  itemsPerPage = 0,
  pageNumber = 1,
  onNextPage,
  onPreviousPage,
  totalPages = 0,
}) => {
  const { isDarkMode } = useThemeDark(); // Usamos el hook para determinar el modo
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);
const startIndex = (pageNumber - 1) * itemsPerPage;
const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={`p-6 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} shadow-md rounded-lg`}>
      {/* Título y botones */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleGoBack}
          className=" top-4 left-4 p-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 flex items-center space-x-2"
        >
          <FaArrowLeft />
        </button>
        <h3 className="text-2xl font-bold">{title}</h3>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={onAdd}
        >
          Agregar nuevo
        </button>
      </div>

      {/* Tabla */}
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
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
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
                      onClick={() => onDelete(item)}
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
          {data.length > itemsPerPage && (
            
            <div className="flex justify-center items-center mt-4 space-x-4">
              <button
                onClick={onPreviousPage}
                disabled={pageNumber === 1}
                className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaArrowLeft />
              </button>
              <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Página {pageNumber} de {totalPages}
              </span>
              <button
                onClick={onNextPage}
                disabled={pageNumber === totalPages}
                className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaArrowLeft className="rotate-180" />
              </button>
            </div>
          )}
      </div>

      
    </div>
  );
};

export default AdminTable;
