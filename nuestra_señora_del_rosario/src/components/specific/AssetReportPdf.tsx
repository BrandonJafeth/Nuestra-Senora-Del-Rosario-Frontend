import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { AssetType } from "../../types/AssetType";

// Se copian y adaptan los estilos del reporte de inventario
const styles = StyleSheet.create({
  page: { 
    padding: 20, 
    fontFamily: 'Helvetica' 
  },
  header: { 
    fontSize: 22, 
    marginBottom: 20, 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    paddingBottom: 8,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    borderBottomStyle: 'solid',
    paddingVertical: 5,
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    textAlign: 'center',
    color: '#555',
  },
});

interface AssetReportPDFProps {
  assets: AssetType[];
}

const AssetReportPDF: React.FC<AssetReportPDFProps> = ({ assets }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Reporte de Activos</Text>

      {/* Encabezado de la tabla */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableCellHeader}>Nombre</Text>
        <Text style={styles.tableCellHeader}>Serie</Text>
        <Text style={styles.tableCellHeader}>Costo</Text>
        <Text style={styles.tableCellHeader}>Ubicación</Text>
        <Text style={styles.tableCellHeader}>Condición</Text>
      </View>

      {/* Filas con los activos */}
      {assets.map((asset) => (
        <View style={styles.tableRow} key={asset.idAsset}>
          <Text style={styles.tableCell}>{asset.assetName}</Text>
          <Text style={styles.tableCell}>{asset.serialNumber}</Text>
          <Text style={styles.tableCell}>{asset.originalCost}</Text>
          <Text style={styles.tableCell}>{asset.location}</Text>
          <Text style={styles.tableCell}>{asset.assetCondition}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default AssetReportPDF;
