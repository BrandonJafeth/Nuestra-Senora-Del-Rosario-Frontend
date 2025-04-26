import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa'; // Importamos el icono de búsqueda
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface TableProps<T> {
  data: T[];
  headers: string[];
  renderRow: (item: T) => JSX.Element;
  isLoading: boolean;
  skeletonRows?: number;
  isDarkMode: boolean;
  pageNumber: number;
  totalPages?: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  emptyMessage?: string; // Mensaje personalizable para cuando no hay datos
}

const ReusableTableRequests = <T,>({
  data,
  headers,
  renderRow,
  isLoading,
  skeletonRows = 5,
  isDarkMode,
  pageNumber,
  totalPages = 1,
  onNextPage,
  onPreviousPage,
  emptyMessage = "No se encontraron datos", // Mensaje predeterminado
}: TableProps<T>) => {
  // Verificar si hay datos disponibles
  const hasData = !isLoading && data.length > 0;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-transparent rounded-lg shadow-md">
        <thead className='min-w-full table-auto'>
          <tr className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} text-center`}>
            {headers.map((header, index) => (
              <th key={index} className="p-4">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center">
          {isLoading ? (
            [...Array(skeletonRows)].map((_, i) => (
              <tr key={i}>
                {headers.map((_, j) => (
                  <td key={j} className="p-4">
                    <Skeleton height={20} width="80%" />
                  </td>
                ))}
              </tr>
            ))
          ) : hasData ? (
            data.map((item) => renderRow(item))
          ) : (
            <tr>
              <td colSpan={headers.length} className="py-8">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-4xl mb-2 text-gray-400">
                    <FaSearch />
                  </div>
                  <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {emptyMessage}
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Controles de paginación - solo mostrar si hay datos o está cargando */}
      {(hasData || isLoading) && (
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            onClick={onPreviousPage}
            disabled={pageNumber === 1}
            className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaArrowLeft />
          </button>

          <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
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
      )}
    </div>
  );
};

export default ReusableTableRequests;
