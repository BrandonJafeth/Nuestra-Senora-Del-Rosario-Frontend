import React, { useState } from 'react';
import Modal from 'react-modal';
import { useThemeDark } from '../../hooks/useThemeDark';
import { InventoryReport } from '../../types/InventoryType';

interface DailyMovementsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  movements: InventoryReport[] | null;
  formattedDate: string;
  isLoading: boolean;
}

const ITEMS_PER_PAGE = 3; // Número de elementos por página

const DailyMovementsModal: React.FC<DailyMovementsModalProps> = ({
  isOpen,
  onRequestClose,
  movements,
  formattedDate,
  isLoading,
}) => {
  const { isDarkMode } = useThemeDark();
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual

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
      className={`relative z-50 w-full max-w-md mx-auto p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Movimientos para {formattedDate}</h2>

      {isLoading ? (
        <p className="text-center">Cargando movimientos...</p>
      ) : movements && movements.length > 0 ? (
        <>
          <ul className="space-y-2">
            {paginatedMovements.map((movement) => (
              <li key={movement.productID} className="border-b py-2">
                <p>Producto: {movement.productName}</p>
                <p>Ingresos: {movement.totalIngresos}</p>
                <p>Egresos: {movement.totalEgresos}</p>
                <p>Unidad: {movement.unitOfMeasure}</p>
              </li>
            ))}
          </ul>
          
          {/* Paginación */}
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Anterior
            </button>
            <span className="text-center">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Siguiente
            </button>
          </div>
        </>
      ) : (
        <p className="text-center">No hay movimientos registrados para este día.</p>
      )}

      <button
        type="button"
        onClick={() => {
          setCurrentPage(1); // Reinicia la página al cerrar
          onRequestClose();
        }}
        className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Cerrar
      </button>
    </Modal>
  );
};

export default DailyMovementsModal;
