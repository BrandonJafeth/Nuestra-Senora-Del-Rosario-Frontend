
export type VolunteerRequest = {
    id_FormVoluntarie: number;
    vn_Name: string;
    vn_Lastname1: string;
    vn_Lastname2: string;
    vn_Phone: string;
    vn_Email: string;
    delivery_Date: Date;
    end_Date: Date;
    name_voluntarieType: string;
    status:  'Aceptada' | 'Rechazada' | 'Pendiente';
  };
  



