export interface ResidentMedication {
    prescribedDose : number
    startDate : string
    endDate? : string
    notes : string
    id_Resident : number
    id_MedicamentSpecific : number
}