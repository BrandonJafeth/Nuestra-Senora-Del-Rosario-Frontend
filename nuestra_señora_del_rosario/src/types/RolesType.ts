export interface RoleType {
    idRole: number;
    nameRole: string;
  }

  export interface RoleAssignmentProps {
    employeeDni: number; // Recibe la cédula del empleado
    onCancel: () => void; // Callback para cuando se presiona "Cancelar"
  }