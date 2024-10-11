// types/ApplicationType.ts
export interface ApplicationRequest {
    status: string;
    id_ApplicationForm: number;
    id_Applicant: number;
    name_AP: string;
    lastname1_AP: string;
    lastname2_AP: string;
    age_AP: number;
    cedula_AP: string;
    location: string;
    id_Guardian: number;
    name_GD: string;
    lastname1_GD: string;
    lastname2_GD: string;
    cedula_GD: string;
    email_GD: string;
    phone_GD: string;
    applicationDate: string;
    status_Name: string;
  }
  