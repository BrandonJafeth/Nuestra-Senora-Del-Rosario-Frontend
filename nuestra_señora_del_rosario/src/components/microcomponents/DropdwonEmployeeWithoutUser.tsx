// src/components/microcomponents/DropdownEmployeeWithoutUser.tsx
import React from 'react'
import Select, { SingleValue } from 'react-select'
import { useEmployeesWithoutUser } from '../../hooks/useEmployeeWithoutUser'

interface EmployeeOption {
  value: number
  label: string
}

interface EmployeeDropdownProps {
  value: number | null
  onChange: (value: number | null) => void
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
}

const DropdownEmployeeWithoutUser: React.FC<EmployeeDropdownProps> = ({
  value,
  onChange,
}) => {
  const {
    data: employees,
    isLoading,
    isError,
    error,
  } = useEmployeesWithoutUser()

  if (isLoading) {
    return <p>Cargando empleados…</p>
  }
  if (isError) {
    return <p className="text-red-500">Error: {error?.message}</p>
  }

  const options: EmployeeOption[] = (employees || []).map((emp) => ({
    value: emp.dni,
    label: emp.fullName,
  }))

  const selectedOption = options.find((o) => o.value === value) ?? null

  return (
    <Select<EmployeeOption, false>
      options={options}
      value={selectedOption}
      onChange={(opt: SingleValue<EmployeeOption>) =>
        onChange(opt?.value ?? null)
      }
      styles={customStyles}
      placeholder="Selecciona un empleado"
      isSearchable
      isClearable
    />
  )
}

export default DropdownEmployeeWithoutUser
