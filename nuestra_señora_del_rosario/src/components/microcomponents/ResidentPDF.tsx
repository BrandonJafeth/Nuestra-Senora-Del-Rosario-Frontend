import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { Resident } from "../../types/ResidentsType";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },

  // Encabezado
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  logo: { width: 80, height: 80 },

  // Título
  titleContainer: { textAlign: "center", borderBottom: "2 solid #000", paddingBottom: 5, marginBottom: 10 },
  title: { fontSize: 16, fontWeight: "bold" },

  // Secciones generales
  section: { 
    marginBottom: 16, 
    padding: 14, 
    border: "1 solid #ccc", 
    borderRadius: 8, 
    backgroundColor: "#f8f8f8"
  },

  fieldContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  field: { fontSize: 13, fontWeight: "bold" },
  text: { fontSize: 12 },

  // Estilos de tabla mejorada
  table: { display: "flex", width: "100%", marginTop: 10 },
  tableRow: { flexDirection: "row", borderBottom: "1 solid #ccc", paddingVertical: 6 },
  tableHeader: { fontSize: 13, fontWeight: "bold", flexGrow: 1, textAlign: "center" },
  tableCell: { fontSize: 12, flexGrow: 1, textAlign: "center" }
});

const ResidentPDF = ({ resident }: { resident: Resident }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      {/* Encabezado */}
      <View style={styles.header}>
        <Image style={styles.logo} src="https://i.ibb.co/TwbrSPf/Icon-whitout-fondo.png" />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>GESTIÓN DE RESIDENTES</Text>
          <Text>Hogar de Ancianos Nuestra Señora del Rosario</Text>
        </View>
      </View>

      {/* Datos Personales */}
      <View style={styles.section}>
        <Text style={styles.title}>Datos Personales</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.field}>Nombre:</Text>
          <Text style={styles.text}>{resident?.name_RD} {resident?.lastname1_RD} {resident?.lastname2_RD}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.field}>Cédula:</Text>
          <Text style={styles.text}>{resident?.cedula_RD}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.field}>Sexo:</Text>
          <Text style={styles.text}>{resident?.sexo}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.field}>Edad:</Text>
          <Text style={styles.text}>{resident?.age} años</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.field}>Domicilio:</Text>
          <Text style={styles.text}>{resident?.location_RD}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.field}>Fecha de Entrada:</Text>
          <Text style={styles.text}>{new Date(resident?.entryDate ?? "").toLocaleDateString()}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.field}>Fecha de Nacimiento:</Text>
          <Text style={styles.text}>{new Date(resident?.fechaNacimiento ?? "").toLocaleDateString()}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.field}>Telefono del Encargado:</Text>
          <Text style={styles.text}>{resident?.guardianPhone}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.field}>Estatus en el Hogar:</Text>
          <Text style={styles.text}>{resident?.status}</Text>
        </View>
      </View>

      {/* Medicamentos (más espacio y diseño limpio) */}
      <View style={styles.section}>
        <Text style={styles.title}>📌 Medicamentos</Text>
        {resident?.medications?.length ? (
          resident.medications.map((med: any) => (
            <View key={med.id_ResidentMedication} style={{ marginBottom: 12, marginTop: 6 }}>
              <Text style={[styles.text, {marginLeft: 6}, { fontSize: 13, fontWeight: "bold" }]}>
                {med.name_MedicamentSpecific} - {med.prescribedDose} {med.unitOfMeasureName}
              </Text>
              {med.notes && (
                <Text style={{ fontSize: 11, fontStyle: "italic", color: "#555", marginTop: 4, marginLeft: 6 }}>
                  📌 Notas: {med.notes}
                </Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.text}>No hay medicamentos registrados.</Text>
        )}
      </View>

      {/* Patologías (más espacio y diseño limpio) */}
      <View style={styles.section}>
        <Text style={styles.title}>⚕️ Patologías</Text>
        {resident?.pathologies?.length ? (
          resident.pathologies.map((path: any) => (
            <View key={path.id_ResidentPathology} style={{ marginBottom: 12, marginTop: 6 }}>
              <Text style={[styles.text, {marginLeft: 6}, { fontSize: 13, fontWeight: "bold" }]}>
                {path.name_Pathology}
              </Text>
              <Text style={  { fontSize: 11, fontStyle: "italic", color: "#555", marginTop: 4, marginLeft: 6 }}>{path.resume_Pathology}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No hay patologías registradas.</Text>
        )}
      </View>

      {/* Citas Médicas (mejor separación y diseño profesional) */}
      <View style={styles.section}>
        <Text style={styles.title}>📅 Citas médicas</Text>
        {resident?.appointments?.length ? (
          <View style={styles.table}>
            <View style={[styles.tableRow, { backgroundColor: "#ddd", paddingVertical: 8 }]}>
              <Text style={styles.tableHeader}>Fecha</Text>
              <Text style={styles.tableHeader}>Hora</Text>
              <Text style={styles.tableHeader}>Encargado</Text>
              <Text style={styles.tableHeader}>Centro Médico</Text>
            </View>
            {resident.appointments.map((appointment: any) => (
              <View key={appointment.id_Appointment} style={[styles.tableRow, { paddingVertical: 6 }]}>
                <Text style={styles.tableCell}>{new Date(appointment.date).toLocaleDateString()}</Text>
                <Text style={styles.tableCell}>{appointment.time}</Text>
                <Text style={styles.tableCell}>{appointment.appointmentManager}</Text>
                <Text style={styles.tableCell}>{appointment.healthcareCenterName}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.text}>No tiene citas médicas registradas.</Text>
        )}
      </View>

    </Page>
  </Document>
);

export default ResidentPDF;
