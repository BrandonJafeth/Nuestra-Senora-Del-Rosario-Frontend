import { useState } from 'react';
import { useMutation } from 'react-query';
import applicationService from '../services/ApplicationService';
import { useToast } from './useToast';
import { ApplicationRequest } from '../types/ApplicationType';

export const useInsertRequestForm = () => {
  const [name_AP, setName_AP] = useState('');
  const [lastName1_AP, setLastname1_AP] = useState('');
  const [lastName2_AP, setLastname2_AP] = useState('');
  const [age_AP, setAge_AP] = useState(0);
  const [cedula_AP, setCedula_AP] = useState('');
  const [location_AP, setLocation] = useState('');
  const [guardianName, setName_GD] = useState('');
  const [guardianCedula, setCedula_GD] = useState('');
  const [guardianPhone, setPhone_GD] = useState('');

  const { showToast } = useToast();

  // Mutación para crear una nueva solicitud
  const { mutate: createRequest, isLoading, isError, error } = useMutation(
    async (newRequest: ApplicationRequest) => {
      return applicationService.createApplicationRequest(newRequest);
    }
  );

  // Manejador de envío del formulario
  const handleSubmit = () => {
    return new Promise((resolve) => {
      createRequest(
        {
          id_ApplicationForm: 0,
          id_Applicant: 0,
          name_AP,
          lastName1_AP,
          lastName2_AP,
          age_AP,
          cedula_AP,
          location_AP,
          id_Guardian: 0,
          guardianName,
          guardianLastName1: '',
          guardianLastName2: '',
          guardianCedula: '',
          guardianEmail: '',
          guardianPhone: '',
          applicationDate: new Date().toISOString(),
          status_Name: 'Approved'
        },
        {
          onSuccess: () => {
            showToast('Residente añadido exitosamente', 'success');
            resolve(true); // Éxito, resolvemos la promesa
          },
          onError: () => {
            showToast('Error añadiendo residente', 'error');
            resolve(false); // Error, devolvemos false
          },
        }
      );
    });
  };

  return {
    name_AP,
    lastName1_AP,
    lastName2_AP,
    age_AP,
    cedula_AP,
    location,
    guardianName,
    guardianCedula,
    guardianPhone,
    setName_AP,
    setLastname1_AP,
    setLastname2_AP,
    setAge_AP,
    setCedula_AP,
    setLocation,
    setName_GD,
    setCedula_GD,
    setPhone_GD,
    handleSubmit,
    isLoading,
    isError,
    error,
  };
};
