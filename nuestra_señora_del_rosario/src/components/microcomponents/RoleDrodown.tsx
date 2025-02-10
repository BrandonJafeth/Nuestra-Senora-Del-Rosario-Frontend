import Select, { SingleValue } from 'react-select';
import { useQuery } from 'react-query';
import roleService from '../../services/RolesServices';

interface RoleOption {
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

interface RoleDropdownProps {
  value: number;
  onChange: (value: number) => void;
}

const RoleDropdown: React.FC<RoleDropdownProps> = ({ value, onChange }) => {
  // Hook para obtener los roles desde el servicio
  const { data: roles, isLoading, isError } = useQuery('roles', async () => {
    const response = await roleService.getAllRoles();
    return response.data;
  });

  // Convertimos los roles en opciones de react-select
  const options = Array.isArray(roles)
    ? roles.map((role) => ({
        value: role.idRole,
        label: role.nameRole,
      }))
    : [];

  // Buscamos la opción seleccionada actualmente
  const selectedOption = options.find((option) => option.value === value) || null;

  if (isLoading) return <p>Cargando roles...</p>;
  if (isError) return <p>Error al cargar roles</p>;

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={(selected: SingleValue<RoleOption>) => onChange(selected?.value ?? 0)}
      styles={customStyles}
      placeholder="Selecciona un rol"
      isSearchable
    />
  );
};

export default RoleDropdown;
