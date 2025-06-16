// FILE: components/InventoryReportPDF.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
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
  logo: {
    width: 120,
    height: 80,
    objectFit: 'contain',
  },
  headerInfo: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
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
      {/* Encabezado con logo a la izquierda y fecha centrada */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <View style={{ flex: 1 }}>
          <Image 
            src="https://i.ibb.co/TwbrSPf/Icon-whitout-fondo.png"
            style={styles.logo}
          />
        </View>
        <View style={{ flex: 2, alignItems: 'center' }}>
          <Text>Fecha: {new Date().toLocaleDateString()}</Text>
        </View>
        <View style={{ flex: 1 }} /> {/* Espacio vacío a la derecha para mantener centrado */}
      </View>

      {/* Encabezado de la tabla */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableCellHeader}>Producto</Text>
        <Text style={styles.tableCellHeader}>Total Inicio de mes</Text>
        <Text style={styles.tableCellHeader}>Total ingresos</Text>
        <Text style={styles.tableCellHeader}>Total egresos</Text>
        <Text style={styles.tableCellHeader}>U.medida</Text>
        <Text style={styles.tableCellHeader}>Total en bodega</Text>
      </View>

      {/* Filas de datos */}
      {report.map((item) => (
        <View style={styles.tableRow} key={item.productID}>
          <Text style={styles.tableCell}>{item.productName}</Text>
          <Text style={styles.tableCell}>{item.initialBalance}</Text>
          <Text style={styles.tableCell}>{item.totalIngresos}</Text>
          <Text style={styles.tableCell}>{item.totalEgresos}</Text>
          <Text style={styles.tableCell}>{item.unitOfMeasure}</Text>
          <Text style={styles.tableCell}>{item.stockActual}</Text>
        </View>
      ))}
    </Page>
  </Document>
);


export default InventoryReportPDF;
