import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { useInventoryReport } from '../../hooks/useInventoryReport';
import InventoryReportPDF from '../specific/InventoryReport';
import LoadingSpinner from './LoadingSpinner';

interface InventoryReportViewerProps {
  month: number;
  year: number;
}

const InventoryReportViewer: React.FC<InventoryReportViewerProps> = ({ month, year }) => {
  const { data: report, isLoading, error } = useInventoryReport(month, year);
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    if (!report) return;
    const pdfDoc = <InventoryReportPDF report={report} />;
    const blob = await pdf(pdfDoc).toBlob(); // Genera el PDF como un blob
    saveAs(blob, `Inventory_Report_${month}_${year}.pdf`); // Guarda el PDF usando file-saver
    setLoading(false);
  };

  if (isLoading) return <div><LoadingSpinner /></div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {report && (
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Generando reporte...' : 'Descargar Reporte'}
        </button>
      )}
    </div>
  );
};

export default InventoryReportViewer;
