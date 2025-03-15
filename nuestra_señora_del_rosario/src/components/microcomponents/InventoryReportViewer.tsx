// FILE: components/InventoryReportViewer.tsx
import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import InventoryReportPDF from '../specific/InventoryReport';
import ReportSelectionModal from './ReportSelectionModal';
import inventoryService from '../../services/InventoryService'; // Importa el servicio

import { InventoryReport } from '../../types/InventoryType';

interface InventoryReportViewerProps {
  month: number;
  year: number;
}

const InventoryReportViewer: React.FC<InventoryReportViewerProps> = ({ month, year }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openReportModal = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  /**
   * Se invoca cuando se confirma la selección de filtros en el modal.
   * Llama al endpoint con { categoryId, productId, measure } para obtener el reporte,
   * mapea la data (si es necesario) y genera el PDF.
   */
  const handleConfirmReport = async (selection: {
    categoryId: number;
    productId: number;
    measure: string;
  }) => {
    setIsReportModalOpen(false);
    setLoading(true);
    try {
      // Llama al método del servicio de forma imperativa
      const response = await inventoryService.getReportByCategory(
        month,
        year,
        selection.categoryId,
        [selection.measure],
        [selection.productId]
      );
      // Suponemos que la respuesta tiene el formato { item1: InventoryReport[], item2: number }
      const reportData: InventoryReport[] = response.data;
      const blob = await pdf(<InventoryReportPDF report={reportData} />).toBlob();
      saveAs(blob, `Reporte_Mensual_Inventario_${month}_${year}.pdf`);
    } catch (error) {
      console.error('Error generando reporte:', error);
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
        <ReportSelectionModal
          isOpen={isReportModalOpen}
          onRequestClose={closeReportModal}
          onConfirm={handleConfirmReport}
        />
      )}
    </div>
  );
};

export default InventoryReportViewer;
