// FILE: components/InventoryReportViewer.tsx
import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import InventoryReportPDF from '../specific/InventoryReport';
import ReportSelectionModal from './ReportSelectionModal';
import CategoryReportModal from './CategoryReportModal';
import inventoryService from '../../services/InventoryService';
import { InventoryReport } from '../../types/InventoryType';
import { useAuth } from '../../hooks/useAuth';

interface InventoryReportViewerProps {
  month: number;
  year: number;
}

const InventoryReportViewer: React.FC<InventoryReportViewerProps> = ({ month, year }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { selectedRole } = useAuth();

  const openReportModal = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  
  const handleConfirmReport = async (selection: {
    categoryId: number;
    productId?: number;
    measure?: string;
  }) => {
    closeReportModal();
    setLoading(true);
    try {
      // Si productId o measure no se proporcionan, se envían arreglos vacíos
      const productIds = selection.productId ? [selection.productId] : [];
      const targetUnits = selection.measure ? selection.measure : '';
      
      const response = await inventoryService.getMonthlyReportWithBalance(
        month,
        year,
        selection.categoryId,
        targetUnits,
        productIds
      );

      const reportData = response.data as InventoryReport[];
      const blob = await pdf(<InventoryReportPDF report={reportData} />).toBlob();
      saveAs(blob, `Reporte_Mensual_Inventario_${month}_${year}.pdf`);
    } catch (error) {
    }
    setLoading(false);
  };

  return (
    <div>
      <button
        onClick={openReportModal}
        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-200"
        disabled={loading}
      >
        {loading ? 'Generando Reporte...' : 'Descargar Reporte'}
      </button>

      {isReportModalOpen && (
        <>
          {selectedRole && selectedRole.toLowerCase() === 'inventario' ? (
            // Modal completo para usuarios de inventario
            <ReportSelectionModal
              isOpen={isReportModalOpen}
              onRequestClose={closeReportModal}
              onConfirm={handleConfirmReport}
            />
          ) : (
            // Modal simple para otros usuarios, donde solo se selecciona la categoría.
            <CategoryReportModal
              isOpen={isReportModalOpen}
              onRequestClose={closeReportModal}
              onConfirm={(categoryId: number) =>
                handleConfirmReport({ categoryId, productId: undefined, measure: '' })
              }
            />
          )}
        </>
      )}
    </div>
  );
};

export default InventoryReportViewer;
