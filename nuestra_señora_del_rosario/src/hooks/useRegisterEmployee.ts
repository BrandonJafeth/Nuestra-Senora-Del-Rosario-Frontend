import { useState } from 'react';
import { useIcon } from './useIcons'; // Hook de iconos
import { useThemeDark } from './useThemeDark'; // Hook para modo oscuro
import { useToast } from './useToast'; // Hook de Toast
import employeeService from '../services/EmployeeService'; // Servicio de empleados

export const useEmployeeForm = () => {
  const { getIcon } = useIcon(); 
  const { isDarkMode } = useThemeDark(); 
  const { showToast, message, type } = useToast(); 

  // Estados para los campos del formulario
  const [dni, setDni] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName1, setLastName1] = useState('');
  const [lastName2, setLastName2] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [id_TypeOfSalary, setTypeOfSalaryId] = useState(0); // Corregido
  const [id_Profession, setProfession] = useState(0); // Corregido

  // Manejo de envío del formulario
  const handleSubmit = async (e: { preventDefault: () => void; }): Promise<boolean> => {
    e.preventDefault();

    const empleadoData = {
      dni: parseInt(dni) || 0, // Asegura que es un número válido
      first_Name: firstName,
      last_Name1: lastName1,
      last_Name2: lastName2,
      phone_Number: phoneNumber,
      address,
      email,
      emergency_Phone: emergencyPhone, // Corregido
      id_TypeOfSalary, // Corregido
      id_Profession // Corregido
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
      
      return true; // Indicar que el registro fue exitoso
    } catch (error: any) {
      // Manejar errores del backend
      const errorMessage = error.response?.data?.message || 'Error al crear el empleado. Intente de nuevo.';
      showToast(`❌ ${errorMessage}`, 'error');
      return false; // Indicar que hubo un error
    }
  };

  return {
    dni, setDni, firstName, setFirstName, lastName1, setLastName1, lastName2, setLastName2, phoneNumber, setPhoneNumber,
    address, setAddress, email, setEmail, emergencyPhone, setEmergencyPhone, id_TypeOfSalary, setTypeOfSalaryId, id_Profession,
    handleSubmit, getIcon, isDarkMode, showToast, message, type, setProfession
  };
};
