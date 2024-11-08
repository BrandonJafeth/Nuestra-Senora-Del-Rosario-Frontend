import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useInventoryReport } from '../../hooks/useInventoryReport';
import InventoryReportPDF from '../specific/InventoryReport';
import LoadingSpinner from './LoadingSpinner';

interface InventoryReportViewerProps {
  month: number;
  year: number;
}

const InventoryReportViewer: React.FC<InventoryReportViewerProps> = ({ month, year }) => {
  const { data: report, isLoading, error } = useInventoryReport(month, year);

  if (isLoading) return <div><LoadingSpinner /></div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {report && (
        <PDFDownloadLink
          document={<InventoryReportPDF report={report} />}
          fileName={`Inventory_Report_${month}_${year}.pdf`}
        >
          {({ loading }: { loading: boolean }) => (
            <React.Fragment>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-200">
                {loading ? 'Generando reporte...' : 'Descargar Reporte'}
              </button>
            </React.Fragment>
          )}
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default InventoryReportViewer;
