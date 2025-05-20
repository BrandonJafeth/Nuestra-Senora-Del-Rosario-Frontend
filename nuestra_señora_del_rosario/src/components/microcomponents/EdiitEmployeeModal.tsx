// src/components/modals/EditEmployeeModal.tsx

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useEmployeeInfo } from '../../hooks/useEmployeeInfo';
import { useUpdateEmployee } from '../../hooks/useUpdateEmployee';
import { useProfession } from '../../hooks/useProfession';
import { useTypeSalary } from '../../hooks/useTypeSalary';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import { EmployeeUpdateDto } from '../../types/EmployeeUpdateType';

Modal.setAppElement('#root');

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dni: number;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ isOpen, onClose, dni }) => {
  const { showToast, message, type } = useToast();
  const { data: employee, isLoading: loadingInfo, isError } = useEmployeeInfo(dni);
  const updateMutation = useUpdateEmployee();
  const { data: professions } = useProfession();
  const { data: salaryTypes } = useTypeSalary();

  // Estado de formulario y modo edición
  const [form, setForm] = useState<EmployeeUpdateDto>({
    firstName: '',
    lastName1: '',
    lastName2: '',
    phoneNumber: '',
    address: '',
    email: '',
    emergencyPhone: '',
    idTypeOfSalary: 0,
    idProfession: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado para errores de validación
  const [errors, setErrors] = useState({
    firstName: '',
    lastName1: '',
    lastName2: '',
    phoneNumber: '',
    address: '',
    email: '',
    emergencyPhone: '',
    idTypeOfSalary: '',
    idProfession: '',
  });

  // Precarga los datos cuando llegan
  useEffect(() => {
    if (employee) {
      setForm({
        firstName: employee.first_Name,
        lastName1: employee.last_Name1,
        lastName2: employee.last_Name2 || '',
        phoneNumber: employee.phone_Number || '',
        address: employee.address,
        email: employee.email || '',
        emergencyPhone: employee.emergency_Phone || '',
        idTypeOfSalary: employee.id_TypeOfSalary,
        idProfession: employee.id_Profession,
      });
    }
  }, [employee]);

  if (!isOpen) return null;
  if (loadingInfo) return <LoadingSpinner />;
  if (isError) return <p className="text-red-500">Error al cargar empleado</p>;

  // Función para validar campos
  const validateField = (name: string, value: string | number) => {
    let error = '';
    
    switch (name) {
      case 'firstName':
        if (!value) error = 'El nombre es requerido';
        else if (typeof value === 'string' && value.length > 50) 
          error = 'El nombre no debe exceder los 50 caracteres';
        else if (typeof value === 'string' && value.length < 3)
          error = 'El nombre debe tener al menos 3 caracteres';
        else if (typeof value === 'string' && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value))
          error = 'El nombre solo debe contener letras';
        break;
        
      case 'lastName1':
        if (!value) error = 'El primer apellido es requerido';
        else if (typeof value === 'string' && value.length > 50) 
          error = 'El apellido no debe exceder los 50 caracteres';
        else if (typeof value === 'string' && value.length < 3)
          error = 'El apellido debe tener al menos 3 caracteres';
        else if (typeof value === 'string' && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value))
          error = 'El apellido solo debe contener letras';
        break;
          case 'lastName2':
            if (!value) error = 'El segundo apellido es requerido';
            else if (typeof value === 'string' && value.length > 50) 
              error = 'El segundo apellido no debe exceder los 50 caracteres';
            else if (typeof value === 'string' && value.length < 3)
              error = 'El segundo apellido debe tener al menos 3 caracteres';
            else if (typeof value === 'string' && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value))
              error = 'El apellido solo debe contener letras';
            break;
        
      case 'phoneNumber':
        if (!value && isEditing) 
          error = 'El teléfono es requerido';
        else if (typeof value === 'string' && value && !/^\d{8,12}$/.test(value)) 
          error = 'El número de teléfono debe tener entre 8 y 12 dígitos';
        break;
        
      case 'address':
        if (!value) error = 'La dirección es requerida';
        else if (typeof value === 'string' && value.length < 5) 
          error = 'La dirección debe tener al menos 5 caracteres';
        else if (typeof value === 'string' && value.length > 200)
          error = 'La dirección no debe exceder los 200 caracteres';
        break;
        
      case 'email':
        if (!value && isEditing)
          error = 'El email es requerido';
        else if (typeof value === 'string' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) 
          error = 'Formato de email inválido';
        break;
        
      case 'emergencyPhone':
        if (!value && isEditing)
          error = 'El teléfono de emergencia es requerido';
        else if (typeof value === 'string' && value && !/^\d{8,12}$/.test(value))
          error = 'El teléfono de emergencia debe tener entre 8 y 12 dígitos';
        break;
        
      case 'idProfession':
        if (isEditing && (!value || value === 0)) 
          error = 'Debe seleccionar una profesión';
        break;
        
      case 'idTypeOfSalary':
        if (isEditing && (!value || value === 0)) 
          error = 'Debe seleccionar un tipo de salario';
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const fieldValue = name.startsWith('id') ? Number(value) : value;
    
    setForm(prev => ({
      ...prev,
      [name]: fieldValue,
    }));
    
    // Validar campo al cambiar
    const fieldError = validateField(name, fieldValue);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      firstName: validateField('firstName', form.firstName),
      lastName1: validateField('lastName1', form.lastName1),
      lastName2: validateField('lastName2', form.lastName2),
      phoneNumber: validateField('phoneNumber', form.phoneNumber),
      address: validateField('address', form.address),
      email: validateField('email', form.email),
      emergencyPhone: validateField('emergencyPhone', form.emergencyPhone),
      idTypeOfSalary: validateField('idTypeOfSalary', form.idTypeOfSalary),
      idProfession: validateField('idProfession', form.idProfession),
    };
    
    setErrors(newErrors);
    
    // Verificar si hay errores
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handlePrimaryClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    
    // Validación completa del formulario
    if (!validateForm()) {
      showToast('Por favor, corrija los errores del formulario', 'error');
      return;
    }
    
    updateMutation.mutate(
      { id: dni, data: form },
      {        onSuccess: () => {
          // Primero mostramos el toast, luego cerramos el modal después de un breve retraso
          showToast('Empleado actualizado correctamente', 'success');
          
          // Esperamos un momento antes de cerrar para que el toast sea visible
          setTimeout(() => {
            setIsEditing(false);
            onClose(); // Cerramos el modal después de que el toast sea visible
          }, 1000);
        },
        onError: (error) => {
          showToast(`Error al actualizar: ${error instanceof Error ? error.message : 'Error desconocido'}`, 'error');
        }
      }
    );
  };

  const handleSecondaryClick = () => {
    if (!isEditing) {
      onClose();
    } else {
      // cancelar edición: reset
      if (employee) {
        setForm({
          firstName: employee.first_Name,
          lastName1: employee.last_Name1,
          lastName2: employee.last_Name2 || '',
          phoneNumber: employee.phone_Number || '',
          address: employee.address,
          email: employee.email || '',
          emergencyPhone: employee.emergency_Phone || '',
          idTypeOfSalary: employee.id_TypeOfSalary,
          idProfession: employee.id_Profession,
        });
        // También resetear errores
        setErrors({
          firstName: '',
          lastName1: '',
          lastName2: '',
          phoneNumber: '',
          address: '',
          email: '',
          emergencyPhone: '',
          idTypeOfSalary: '',
          idProfession: '',
        });
      }
      setIsEditing(false);
    }
  };

  // Para mostrar en modo lectura:
  const professionLabel =
    professions?.find(p => p.id_Profession === form.idProfession)?.name_Profession
    || employee?.professionName
    || '';
  const salaryTypeLabel =
    salaryTypes?.find(s => s.id_TypeOfSalary === form.idTypeOfSalary)?.name_TypeOfSalary
    || employee?.typeOfSalaryName
    || '';

  return (    <Modal
      isOpen={isOpen}
      onRequestClose={() => { if (!isEditing) onClose(); }}
      className="p-6 bg-white rounded shadow max-w-2xl mx-auto mt-5 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      shouldCloseOnOverlayClick={!isEditing}
      shouldCloseOnEsc={!isEditing}      style={{
        content: {
          maxHeight: '90vh',
          overflow: 'visible'
        }
      }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Editar Empleado</h2>
      
      <div className="pb-4 px-1">
        <form onSubmit={handlePrimaryClick} className="grid grid-cols-2 gap-x-4">
          {/* Columna 1 */}          <div className="mb-4" style={{ height: '80px' }}>
            <label className="block font-medium mb-1">Nombre <span className="text-red-500">*</span></label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''} ${errors.firstName ? 'border-red-500' : ''}`}
            />
            <div className="h-5 overflow-hidden">
              {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
            </div>
          </div>          <div className="mb-4" style={{ height: '80px' }}>
            <label className="block font-medium mb-1">Primer Apellido <span className="text-red-500">*</span></label>
            <input
              name="lastName1"
              value={form.lastName1}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''} ${errors.lastName1 ? 'border-red-500' : ''}`}
            />
            <div className="h-5 overflow-hidden">
              {errors.lastName1 && <p className="text-red-500 text-xs">{errors.lastName1}</p>}
            </div>
          </div>          <div className="mb-4" style={{ height: '80px' }}>
            <label className="block font-medium mb-1">Segundo Apellido</label>
            <input
              name="lastName2"
              value={form.lastName2}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''} ${errors.lastName2 ? 'border-red-500' : ''}`}
            />
            <div className="h-5 overflow-hidden">
              {errors.lastName2 && <p className="text-red-500 text-xs">{errors.lastName2}</p>}
            </div>
          </div>          <div className="mb-4" style={{ height: '80px' }}>
            <label className="block font-medium mb-1">Teléfono <span className="text-red-500">*</span></label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''} ${errors.phoneNumber ? 'border-red-500' : ''}`}
            />
            <div className="h-5 overflow-hidden">
              {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
            </div>
          </div>          <div className="mb-4" style={{ height: '80px' }}>
            <label className="block font-medium mb-1">Dirección <span className="text-red-500">*</span></label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''} ${errors.address ? 'border-red-500' : ''}`}
            />
            <div className="h-5 overflow-hidden">
              {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
            </div>
          </div>          <div className="mb-4" style={{ height: '80px' }}>
            <label className="block font-medium mb-1">Email <span className="text-red-500">*</span></label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''} ${errors.email ? 'border-red-500' : ''}`}
            />
            <div className="h-5 overflow-hidden">
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
          </div>          <div className="mb-4" style={{ height: '80px' }}>
            <label className="block font-medium mb-1">Teléfono Emergencia <span className="text-red-500">*</span></label>
            <input
              name="emergencyPhone"
              value={form.emergencyPhone}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''} ${errors.emergencyPhone ? 'border-red-500' : ''}`}
            />
            <div className="h-5 overflow-hidden">
              {errors.emergencyPhone && <p className="text-red-500 text-xs">{errors.emergencyPhone}</p>}
            </div>
          </div>          <div className="mb-4" style={{ height: '80px' }}>
            <label className="block font-medium mb-1">Profesión <span className="text-red-500">*</span></label>
            {isEditing ? (
              <>
                <select
                  name="idProfession"
                  value={form.idProfession}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.idProfession ? 'border-red-500' : ''}`}
                >
                  <option value={0}>Selecciona...</option>
                  {professions?.map(p => (
                    <option key={p.id_Profession} value={p.id_Profession}>
                      {p.name_Profession}
                    </option>
                  ))}
                </select>
                <div className="h-5 overflow-hidden">
                  {errors.idProfession && <p className="text-red-500 text-xs">{errors.idProfession}</p>}
                </div>
              </>
            ) : (
              <input
                readOnly
                value={professionLabel}
                className="w-full p-2 border rounded bg-gray-100"
              />
            )}
          </div>          <div className="mb-4" style={{ height: '80px' }}>
            <label className="block font-medium mb-1">Tipo de Salario <span className="text-red-500">*</span></label>
            {isEditing ? (
              <>
                <select
                  name="idTypeOfSalary"
                  value={form.idTypeOfSalary}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.idTypeOfSalary ? 'border-red-500' : ''}`}
                >
                  <option value={0}>Selecciona...</option>
                  {salaryTypes?.map(s => (
                    <option key={s.id_TypeOfSalary} value={s.id_TypeOfSalary}>
                      {s.name_TypeOfSalary}
                    </option>
                  ))}
                </select>
                <div className="h-5 overflow-hidden">
                  {errors.idTypeOfSalary && <p className="text-red-500 text-xs">{errors.idTypeOfSalary}</p>}
                </div>
              </>
            ) : (
              <input
                readOnly
                value={salaryTypeLabel}
                className="w-full p-2 border rounded bg-gray-100"
              />
            )}
          </div>
        </form>
      </div>

      {/* Botones - Centrados como en EditApplicationModal */}
      <div className="mt-4 flex justify-center space-x-4">        <button
          onClick={(e: React.MouseEvent) => handlePrimaryClick(e as React.FormEvent)}
          className={`px-4 py-2 ${
            isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded`}
          disabled={updateMutation.isLoading}
        >
          {isEditing
            ? (updateMutation.isLoading ? <LoadingSpinner /> : 'Guardar')
            : 'Editar'}
        </button>
        <button
          type="button"
          onClick={handleSecondaryClick}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          {isEditing ? 'Cancelar' : 'Cerrar'}
        </button>
      </div>

      {/* Toast con z-index más alto para asegurarnos de que se muestre por encima del modal */}
      <div className="z-[9999]">
        <Toast message={message} type={type} />
      </div>
    </Modal>
  );
};

export default EditEmployeeModal;
