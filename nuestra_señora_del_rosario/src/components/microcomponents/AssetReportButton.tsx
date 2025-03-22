// components/reports/AssetReportButton.tsx
import React from "react";
import { pdf } from "@react-pdf/renderer";
import { AssetType } from "../../types/AssetType";
import AssetReportPDF from "../specific/AssetReportPdf";

interface AssetReportButtonProps {
  assets: AssetType[];
}

const AssetReportButton: React.FC<AssetReportButtonProps> = ({ assets }) => {
  const handleDownload = async () => {
    try {
      // Genera el blob del documento PDF
      const blob = await pdf(<AssetReportPDF assets={assets} />).toBlob();
      // Crea un URL a partir del blob
      const url = URL.createObjectURL(blob);
      // Crea un elemento <a> y simula un clic para descargar
      const link = document.createElement("a");
      link.href = url;
      link.download = "reporte-activos.pdf";
      link.click();
      // Opcional: revoca el URL después de 1 segundo
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Error generando el PDF:", error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
    >
      Descargar Reporte
    </button>
  );
};

export default AssetReportButton;
