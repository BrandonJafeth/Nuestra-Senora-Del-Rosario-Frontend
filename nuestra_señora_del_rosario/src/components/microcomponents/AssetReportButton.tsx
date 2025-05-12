// components/reports/AssetReportButton.tsx
import React from "react";
import { pdf } from "@react-pdf/renderer";
import AssetReportPDF from "../specific/AssetReportPdf";
import { useAllAssets } from "../../hooks/useAllAssets";
import { AssetType } from "../../types/AssetType";

interface AssetReportButtonProps {
  assets: AssetType[];
}

const AssetReportButton: React.FC<AssetReportButtonProps> = ({  }) =>  {
  const { data: allAssets, isLoading } = useAllAssets();

  const handleDownload = async () => {
    try {
      if (!allAssets || allAssets.length === 0) {
        alert("No hay activos para generar el reporte.");
        return;
      }

      const blob = await pdf(<AssetReportPDF assets={allAssets} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "reporte-activos.pdf";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Error generando el PDF:", error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className={`px-4 py-2 rounded-lg transition duration-200 ${
        isLoading
          ? "bg-gray-400 text-white cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      {isLoading ? "Cargando activos..." : "Descargar reporte"}
    </button>
  );
};

export default AssetReportButton;
