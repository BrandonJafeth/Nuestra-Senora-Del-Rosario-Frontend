export interface ResidentMedication {
    id_ResidentMedication : number
    prescribedDose : number
    startDate : string
    endDate? : string
    name_MedicamentSpecific : string
    unitOfMeasureName : string
    notes : string
    id_Resident : number
    id_MedicamentSpecific : number
    updatedAt : string
}