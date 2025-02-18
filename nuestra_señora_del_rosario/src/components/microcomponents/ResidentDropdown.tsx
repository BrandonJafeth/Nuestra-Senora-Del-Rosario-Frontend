import Select, { SingleValue } from 'react-select';
import { useAllResidents } from '../../hooks/useAllResidents';

interface ResidentOption {
  value: number;
  label: string;
}

const customStyles = {
  control: (base: any) => ({
    ...base,
    padding: '2px', // Espaciado similar a un select nativo
    borderRadius: '0.375rem', // Rounded-lg en Tailwind
    borderColor: '#D1D5DB', // Gris claro (border-gray-300 en Tailwind)
    backgroundColor: 'white',
    '&:hover': { borderColor: '#A3A3A3' }, // Hover similar al input
  }),
  option: (base: any, { isFocused }: { isFocused: boolean }) => ({
    ...base,
    backgroundColor: isFocused ? '#E5E7EB' : 'white', // Cambiar fondo en hover (bg-gray-200)
    color: 'black',
  }),
};

interface ResidentDropdownProps {
  value: number;
  onChange: (value: number) => void;
}

const ResidentDropdown: React.FC<ResidentDropdownProps> = ({ value, onChange }) => {
  const { data: residents, isLoading } = useAllResidents(); // Obtener residentes

  // Convertimos los residentes en opciones de react-select
  const options = Array.isArray(residents?.data) ? residents?.data?.map((resident : any) => ({
    value: resident.id_Resident,
    label: `${resident.name_RD} ${resident.lastname1_RD} ${resident.lastname2_RD}`,
  })) : [];

  // Buscamos la opción seleccionada actualmente
  const selectedOption = options.find((option: any) => option.value === value) || null;

  if (isLoading) return <p>Cargando residentes...</p>;

  return (
    <Select
      options={options} // Opciones del select
      value={selectedOption} // Opción seleccionada
      onChange={(selected: SingleValue<ResidentOption>) => onChange(selected?.value ?? 0)}
      styles={customStyles} // Aplicamos estilos personalizados
      placeholder="Selecciona un residente"
      isSearchable // Permitir búsqueda en el dropdown
    />
  );
};

export default ResidentDropdown;
