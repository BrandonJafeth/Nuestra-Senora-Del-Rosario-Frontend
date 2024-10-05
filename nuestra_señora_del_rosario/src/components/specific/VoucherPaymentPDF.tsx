import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font} from '@react-pdf/renderer';

Font.register({
  family: 'Noto Sans',
  src: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf',
});

interface PaymentReceiptPDFProps {
  employee: {
    firstName: string;
    lastName1: string;
    professionName: string;
    typeOfSalaryName: string;
  };
  workedDays: number;
  grossIncome: number;
  extrasHours: number;
  doublesHours: number;
  mandatoryHolidays: number;
  doubleExtras: number;
  mixedHours: number;
  nightHours: number;
  adjustments: number;
  incapacity: number;
  absence: number;
  vacationDays: number;
  deductions: {
    ccss: number;
    embargo: number;
    rentTax: number;
    alimony: number;
    otherDeductions: number;
  };
  netIncome: number;
  paymentDate: string;
}

// Estilos mejorados para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Noto Sans',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 70,
    height: 70,
  },
  section: {
    marginBottom: 10,
  },
  table: {
    width: '100%',
    marginBottom: 10,
    borderBottom: '1px solid #ccc',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px solid #ddd',
    paddingVertical: 4,
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
    borderBottom: '1px solid #aaa',
  },
  row: {
    flexDirection: 'row', // Alinea los elementos en fila
    marginBottom: 5,      // Añade algo de espacio entre filas
  },
  label: {
    fontWeight: 'bold',    // Etiquetas en negrita
    marginRight: 5,        // Espacio entre la etiqueta y el valor
  },
  tableCol: {
    width: '30%',
  },
  tableColSmall: {
    width: '20%',
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'right',
    marginTop: 10,
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 10,
  },
  signature: {
    marginTop: 30,
    textAlign: 'center',
    borderTop: '1px solid #000',
    width: '50%',
    alignSelf: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  rightAlign: {
    textAlign: 'right',
  },
});

/*const formatCurrency = (value: number) => {
  return value > 0 ? `$${new Intl.NumberFormat('es-CR').format(value)}` : '';
};*/


const VoucherPaymentPDF: React.FC<PaymentReceiptPDFProps> = ({
  employee,
  workedDays = 0,
  grossIncome = 0,
  extrasHours = 0,
  doublesHours = 0,
  mandatoryHolidays = 0,
  doubleExtras = 0,
  mixedHours = 0,
  nightHours = 0,
  adjustments = 0,
  incapacity = 0,
  absence = 0,
  vacationDays = 0,
  deductions = {
    ccss: 0,
    embargo: 0,
    rentTax: 0,
    alimony: 0,
    otherDeductions: 0,
  },
  netIncome = 0,
  paymentDate = "",
}) => {
  const totalDeductions =
    (deductions.ccss || 0) +
    (deductions.embargo || 0) +
    (deductions.rentTax || 0) +
    (deductions.alimony || 0) +
    (deductions.otherDeductions || 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado con imagen */}
        <View style={styles.header}>
          <Text>Comprobante de Pago</Text>
          {/* Cambia la URL si no funciona */}
          <Image 
          style={styles.image}
           src="https://i.ibb.co/D5xXgD5/Icon-whitout-fondo.png" />
        </View>

        {/* Fecha de Pago */}
        <View style={styles.section}>
          <Text>Fecha: {paymentDate}</Text>
        </View>

        {/* Información del empleado */}
        {/* Información del empleado en una fila */}
<View style={[styles.section, styles.row]}>
  {/* Etiqueta de empleado */}
  <Text style={styles.label}>Empleado: </Text>
  {/* Valor del empleado */}
  <Text>{employee.firstName || "N/A"} {employee.lastName1 || "N/A"}</Text>
</View>

<View style={[styles.section, styles.row]}>
  {/* Etiqueta de puesto */}
  <Text style={styles.label}>Puesto: </Text>
  {/* Valor del puesto */}
  <Text>{employee.professionName || "N/A"}</Text>
</View>

<View style={[styles.section, styles.row]}>
  {/* Etiqueta de salario */}
  <Text style={styles.label}>Salario: </Text>
  {/* Valor del salario */}
  <Text>{employee.typeOfSalaryName || "N/A"}</Text>
</View>

        {/* Tabla de descripción */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCol}>Descripción</Text>
            <Text style={styles.tableColSmall}>Valores</Text>
            <Text style={styles.tableCol}>Montos</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Salario ({workedDays} días)</Text>
            <Text style={styles.tableColSmall}>{String(workedDays)}</Text>
            <Text style={styles.tableCol}>₡{grossIncome}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Extras (hrs)</Text>
            <Text style={styles.tableColSmall}>{String(extrasHours || 0)}</Text>
            <Text style={styles.tableCol}>₡{extrasHours * 0}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Dobles (hrs)</Text>
            <Text style={styles.tableColSmall}>{String(doublesHours || 0)}</Text>
            <Text style={styles.tableCol}>₡{doublesHours * 0}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Feriados de pago obligatorio (hrs)</Text>
            <Text style={styles.tableColSmall}>{String(mandatoryHolidays || 0)}</Text>
            <Text style={styles.tableCol}></Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Extras dobles</Text>
            <Text style={styles.tableColSmall}>{String(doubleExtras || 0)}</Text>
            <Text style={styles.tableCol}></Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Horas mixtas</Text>
            <Text style={styles.tableColSmall}>{String(mixedHours || 0)}</Text>
            <Text style={styles.tableCol}></Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Horas nocturnas</Text>
            <Text style={styles.tableColSmall}>{String(nightHours || 0)}</Text>
            <Text style={styles.tableCol}></Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Ajustes</Text>
            <Text style={styles.tableColSmall}>{String(adjustments || 0)}</Text>
            <Text style={styles.tableCol}></Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Incapacidad</Text>
            <Text style={styles.tableColSmall}>{String(incapacity || 0)}</Text>
            <Text style={styles.tableCol}></Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Ausencia</Text>
            <Text style={styles.tableColSmall}>{String(absence || 0)}</Text>
            <Text style={styles.tableCol}></Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Vacaciones disfrutadas (días)</Text>
            <Text style={styles.tableColSmall}>{String(vacationDays || 0)}</Text>
            <Text style={styles.tableCol}></Text>
          </View>

          {/* Total devengado bruto */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.bold]}>Bruto devengado</Text>
            <Text style={styles.tableColSmall}></Text>
            <Text style={styles.tableCol}>₡{grossIncome}</Text>
          </View>
        </View>

        {/* Deducciones */}
        <View style={styles.table}>
          <Text style={styles.label}>Deducciones:</Text>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>CCSS (10.67%)</Text>
            <Text style={styles.tableColSmall}>₡{deductions.ccss}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Embargo</Text>
            <Text style={styles.tableColSmall}>₡{deductions.embargo}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Impuesto de Renta</Text>
            <Text style={styles.tableColSmall}>₡{deductions.rentTax}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Pensión Alimenticia</Text>
            <Text style={styles.tableColSmall}>₡{deductions.alimony}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Otras deducciones</Text>
            <Text style={styles.tableColSmall}>₡{deductions.otherDeductions}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.bold]}>Total Deducciones</Text>
            <Text style={styles.tableColSmall}>₡{totalDeductions}</Text>
          </View>
        </View>

        {/* Total Devengado Neto */}
        <Text style={styles.totalAmount}>Total Devengado Neto: ₡{netIncome}</Text>

        {/* Pie de firma */}
        <View style={styles.footer}>
          <Text style={styles.signature}>Firma de recibido</Text>
        </View>
      </Page>
    </Document>
  );
};


export default VoucherPaymentPDF;
