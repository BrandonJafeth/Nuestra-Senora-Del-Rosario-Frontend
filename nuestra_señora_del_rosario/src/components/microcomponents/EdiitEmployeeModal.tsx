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

  // Precarga los datos cuando llegan
  useEffect(() => {
    if (employee) {
      setForm({
        firstName: employee.first_Name,
        lastName1: employee.last_Name1,
        lastName2: employee.last_Name2,
        phoneNumber: employee.phone_Number,
        address: employee.address,
        email: employee.email,
        emergencyPhone: employee.emergency_Phone,
        idTypeOfSalary: employee.id_TypeOfSalary,
        idProfession: employee.id_Profession,
      });
    }
  }, [employee]);

  if (!isOpen) return null;
  if (loadingInfo) return <LoadingSpinner />;
  if (isError) return <p className="text-red-500">Error al cargar empleado</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name.startsWith('id') ? Number(value) : value,
    }));
  };

  const handlePrimaryClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    // validaciones
    if (!form.firstName.trim() || !form.lastName1.trim()) {
      showToast('Nombre y primer apellido son requeridos', 'error');
      return;
    }
    updateMutation.mutate(
      { id: dni, data: form },
      {
        onSuccess: () => {
          showToast('Empleado actualizado correctamente', 'success');
          setIsEditing(false);
        },
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
          lastName2: employee.last_Name2,
          phoneNumber: employee.phone_Number,
          address: employee.address,
          email: employee.email,
          emergencyPhone: employee.emergency_Phone,
          idTypeOfSalary: employee.id_TypeOfSalary,
          idProfession: employee.id_Profession,
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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => { if (!isEditing) onClose(); }}
      className="p-6 bg-white rounded shadow max-w-2xl mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-2xl font-bold mb-4">Editar Empleado</h2>

      <form onSubmit={handlePrimaryClick} className="grid grid-cols-2 gap-4">
        {/* Columna 1 */}
        <div>
          <label className="block font-medium">Nombre</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''}`}
          />
        </div>
        <div>
          <label className="block font-medium">Primer Apellido</label>
          <input
            name="lastName1"
            value={form.lastName1}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''}`}
          />
        </div>
        <div>
          <label className="block font-medium">Segundo Apellido</label>
          <input
            name="lastName2"
            value={form.lastName2}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''}`}
          />
        </div>
        <div>
          <label className="block font-medium">Teléfono</label>
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''}`}
          />
        </div>

        {/* Columna 2 */}
        <div>
          <label className="block font-medium">Dirección</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''}`}
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''}`}
          />
        </div>
        <div>
          <label className="block font-medium">Teléfono Emergencia</label>
          <input
            name="emergencyPhone"
            value={form.emergencyPhone}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''}`}
          />
        </div>
        <div>
          <label className="block font-medium">Profesión</label>
          {isEditing ? (
            <select
              name="idProfession"
              value={form.idProfession}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value={0}>Selecciona...</option>
              {professions?.map(p => (
                <option key={p.id_Profession} value={p.id_Profession}>
                  {p.name_Profession}
                </option>
              ))}
            </select>
          ) : (
            <input
              readOnly
              value={professionLabel}
              className="w-full p-2 border rounded bg-gray-100"
            />
          )}
        </div>
        <div>
          <label className="block font-medium">Tipo de Salario</label>
          {isEditing ? (
            <select
              name="idTypeOfSalary"
              value={form.idTypeOfSalary}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value={0}>Selecciona...</option>
              {salaryTypes?.map(s => (
                <option key={s.id_TypeOfSalary} value={s.id_TypeOfSalary}>
                  {s.name_TypeOfSalary}
                </option>
              ))}
            </select>
          ) : (
            <input
              readOnly
              value={salaryTypeLabel}
              className="w-full p-2 border rounded bg-gray-100"
            />
          )}
        </div>
      </form>

      {/* Botones */}
      <div className="mt-6 flex justify-end space-x-2">
        <button
          onClick={handlePrimaryClick as any}
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

      <Toast message={message} type={type} />
    </Modal>
  );
};

export default EditEmployeeModal;
