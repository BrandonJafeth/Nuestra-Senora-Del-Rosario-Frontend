// FILE: components/InventoryReportPDF.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { InventoryReport } from '../../types/InventoryType';

const styles = StyleSheet.create({
  page: { padding: 20, fontFamily: 'Helvetica' },
  header: { fontSize: 22, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
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

interface InventoryReportPDFProps {
  report: InventoryReport[];
}

const InventoryReportPDF: React.FC<InventoryReportPDFProps> = ({ report }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Reporte Mensual de Inventario</Text>
      
      {/* Encabezado de la tabla */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableCellHeader}>Producto</Text>
        <Text style={styles.tableCellHeader}>Total en Stock</Text>
        <Text style={styles.tableCellHeader}>Total Ingresos</Text>
        <Text style={styles.tableCellHeader}>Total Egresos</Text>
        <Text style={styles.tableCellHeader}>Unidad de Medida</Text>
        <Text style={styles.tableCellHeader}>Total Convertido</Text>
      </View>

      {/* Filas de datos */}
      {report.map((item) => (
        <View style={styles.tableRow} key={item.productID}>
          <Text style={styles.tableCell}>{item.productName}</Text>
          <Text style={styles.tableCell}>{item.totalInStock}</Text>
          <Text style={styles.tableCell}>{item.totalIngresos}</Text>
          <Text style={styles.tableCell}>{item.totalEgresos}</Text>
          <Text style={styles.tableCell}>{item.unitOfMeasure}</Text>
          <Text style={styles.tableCell}>{item.convertedTotalInStock}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default InventoryReportPDF;
