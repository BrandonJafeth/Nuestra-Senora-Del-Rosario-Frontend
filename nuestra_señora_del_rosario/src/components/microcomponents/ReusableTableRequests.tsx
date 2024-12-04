
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
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
}

const ReusableTableRequests = <T,>({
  data,
  headers,
  renderRow,
  isLoading,
  skeletonRows = 5,
  isDarkMode,
  pageNumber,
  totalPages,
  onNextPage,
  onPreviousPage,
}: TableProps<T>) => {
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
          ) : (
            data.map((item) => renderRow(item))
          )}
        </tbody>
      </table>

      {/* Controles de paginación */}
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
    </div>
  );
};

export default ReusableTableRequests;
