// Tipo para la entrada de datos de historial médico (formulario)
export interface MedicalHistoryInput {
  id_Resident: number;
  diagnosis: string;
  treatment: string;
  observations: string;
}
