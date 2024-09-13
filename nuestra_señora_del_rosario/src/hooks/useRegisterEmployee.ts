import { useState } from 'react';
import { useIcon } from './useIcons'; // Hook de iconos
import { useThemeDark } from './useThemeDark'; // Hook para modo oscuro
import { useToast } from './useToast'; // Hook de Toast
import employeeService from '../services/EmployeeService'; // Servicio de empleados

export const useEmployeeForm = () => {
  const { getIcon } = useIcon(); 
  const { isDarkMode } = useThemeDark(); 
  const { showToast, message, type } = useToast(); 

  const [dni, setDni] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName1, setLastName1] = useState('');
  const [lastName2, setLastName2] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [typeOfSalaryId, setTypeOfSalaryId] = useState(0); 
  const [professionId, setProfession] = useState(0); 

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const empleadoData = {
      dni: parseInt(dni),
      firstName,
      lastName1,
      lastName2,
      phoneNumber,
      address,
      email,
      emergencyPhone,
      typeOfSalaryId,
      professionId,
    };

    try {
      await employeeService.createEmployee(empleadoData);
      showToast('Empleado creado exitosamente', 'success');

      // Limpiar formulario
      setDni('');
      setFirstName('');
      setLastName1('');
      setLastName2('');
      setPhoneNumber('');
      setAddress('');
      setEmail('');
      setEmergencyPhone('');
    } catch (error) {
      showToast('Error al crear el empleado. Por favor, intente de nuevo.', 'error');
    }
  };

  return {
    dni, setDni, firstName, setFirstName, lastName1, setLastName1, lastName2, setLastName2, phoneNumber, setPhoneNumber,
    address, setAddress, email, setEmail, emergencyPhone, setEmergencyPhone, typeOfSalaryId, setTypeOfSalaryId, professionId,
    handleSubmit, getIcon, isDarkMode, showToast, message, type, setProfession
  };
};
