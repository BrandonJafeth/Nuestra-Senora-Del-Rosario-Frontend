import Select, { SingleValue } from 'react-select';
import { useEmployee } from '../../hooks/useEmployee';

interface EmployeeOption {
  value: number;
  label: string;
}

const customStyles = {
  control: (base: any) => ({
    ...base,
    padding: '2px',
    borderRadius: '0.375rem',
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
    '&:hover': { borderColor: '#A3A3A3' },
  }),
  option: (base: any, { isFocused }: { isFocused: boolean }) => ({
    ...base,
    backgroundColor: isFocused ? '#E5E7EB' : 'white',
    color: 'black',
  }),
};

interface EmployeeDropdownProps {
  value: number;
  onChange: (value: number) => void;
}

const EmployeeDropdown: React.FC<EmployeeDropdownProps> = ({ value, onChange }) => {
  const { data: employees, isLoading } = useEmployee(1, 100); // Obtener empleados (100 por página para cargar todos)

  // Convertimos los empleados en opciones de react-select
  const options = Array.isArray(employees?.employees)
    ? employees.employees.map((employee) => ({
        value: employee.dni,
        label: `${employee.first_Name} ${employee.last_Name1} ${employee.last_Name2}`,
      }))
    : [];

  // Buscamos la opción seleccionada actualmente
  const selectedOption = options.find((option) => option.value === value) || null;

  if (isLoading) return <p>Cargando empleados...</p>;

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={(selected: SingleValue<EmployeeOption>) => onChange(selected?.value ?? 0)}
      styles={customStyles}
      placeholder="Selecciona un empleado"
      isSearchable
    />
  );
};

export default EmployeeDropdown;
