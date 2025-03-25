// types/PaymentReceiptType.ts
export interface Deduction {
    type: string;
    amount: number;
  }
  
  export interface PaymentReceiptType {
    id: number;
    id_Employee : number;
    employeeDni: number;
    paymentDate: string; // ISO string format
    salary: number;
    overtime: number;
    workedDays: number;
    grossIncome: number;
    totalExtraHoursAmount: number;
    extraHourRate: number;
    doubleExtras: number;
    nightHours: number;
    adjustments: number;
    incapacity: number;
    absence: number;
    vacationDays: number;
    deductionsList: Deduction[];
    totalDeductions: number;
    notes: string;
    employeeName: string;
    employeeLastName: string;
    netIncome: number;
  }
  