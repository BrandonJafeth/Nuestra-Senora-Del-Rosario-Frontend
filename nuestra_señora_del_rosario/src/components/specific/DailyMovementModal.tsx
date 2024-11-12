import React, { useState } from 'react';
import Modal from 'react-modal';
import { useThemeDark } from '../../hooks/useThemeDark';
import { InventoryReport } from '../../types/InventoryType';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface DailyMovementsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  movements: InventoryReport[] | null;
  formattedDate: string;
  isLoading: boolean;
}

const ITEMS_PER_PAGE = 2;

const DailyMovementsModal: React.FC<DailyMovementsModalProps> = ({
  isOpen,
  onRequestClose,
  movements,
  formattedDate,
  isLoading,
}) => {
  const { isDarkMode } = useThemeDark();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = movements ? Math.ceil(movements.length / ITEMS_PER_PAGE) : 1;

  const paginatedMovements = movements
    ? movements.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : [];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Movimientos Diarios"
      className={`relative z-50 w-full max-w-xl mx-auto p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Movimientos para {formattedDate}</h2>

      {isLoading ? (
        <p className="text-center">Cargando movimientos...</p>
      ) : movements && movements.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg">
              <thead>
                <tr className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <th className="p-4 text-left">Producto</th>
                  <th className="p-4 text-left">Ingresos</th>
                  <th className="p-4 text-left">Egresos</th>
                  <th className="p-4 text-left">Unidad</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMovements.map((movement) => (
                  <tr
                    key={movement.productID}
                    className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} border-b`}
                  >
                    <td className="p-4">{movement.productName}</td>
                    <td className="p-4">{movement.totalIngresos}</td>
                    <td className="p-4">{movement.totalEgresos}</td>
                    <td className="p-4">{movement.unitOfMeasure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center mt-4 space-x-4">
  <button
    onClick={handlePreviousPage}
    disabled={currentPage === 1}
    className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300"
  >
    <FaArrowLeft />
  </button>

  <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
    Página {currentPage} de {totalPages}
  </span>

  <button
    onClick={handleNextPage}
    disabled={currentPage === totalPages}
    className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-300"
  >
    <FaArrowRight />
  </button>
</div>
        </>
      ) : (
        <p className="text-center">No hay movimientos registrados para este día.</p>
      )}

      <button
        type="button"
        onClick={() => {
          setCurrentPage(1);
          onRequestClose();
        }}
        className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Cerrar
      </button>
    </Modal>
  );
};

export default DailyMovementsModal;
