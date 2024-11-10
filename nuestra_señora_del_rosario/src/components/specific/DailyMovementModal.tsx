// components/DailyMovementsModal.tsx
import React from 'react';
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

const DailyMovementsModal: React.FC<DailyMovementsModalProps> = ({
  isOpen,
  onRequestClose,
  movements,
  formattedDate,
  isLoading,
}) => {
  const { isDarkMode } = useThemeDark();

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
        <ul className="space-y-2">
          {movements.map((movement) => (
            <li key={movement.productID} className="border-b py-2">
              <p>Producto: {movement.productName}</p>
              <p>Ingresos: {movement.totalIngresos}</p>
              <p>Egresos: {movement.totalEgresos}</p>
              <p>Unidad: {movement.unitOfMeasure}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No hay movimientos registrados para este día.</p>
      )}

      <button
        type="button"
        onClick={onRequestClose}
        className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Cerrar
      </button>
    </Modal>
  );
};

export default DailyMovementsModal;
