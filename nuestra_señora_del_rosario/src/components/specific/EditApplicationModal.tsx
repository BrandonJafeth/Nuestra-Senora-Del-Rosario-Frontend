import React, { useState, useEffect, ChangeEvent } from 'react';
import FormField from '../common/FormField';
import EditApplicationModalLayout from './EditApplicationModalLayout';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import { ApplicationRequest } from '../../types/ApplicationType';

interface EditApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationRequest | null;
  onSave: (application: ApplicationRequest) => void;
  isUpdating: boolean;
  isDarkMode: boolean;
}

const EditApplicationModal: React.FC<EditApplicationModalProps> = ({
  isOpen,
  onClose,
  application,
  onSave,
  isUpdating,
  isDarkMode,
}) => {
  const [editingApplication, setEditingApplication] = useState<ApplicationRequest | null>(application);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ──────────────────────────────────────────────────────────
     Sincroniza el estado local cuando cambia la prop "application"
  ────────────────────────────────────────────────────────── */
  useEffect(() => {
    setEditingApplication(application);
    setErrors({});
  }, [application]);

  /* ──────────────────────────────────────────────────────────
     Handler genérico para todos los inputs
  ────────────────────────────────────────────────────────── */
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!editingApplication) return;

    const { name, value } = e.target;

    // Limpiar error puntual
    if (errors[name]) {
      setErrors(prev => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }

    // Convertir edad a number, el resto queda string
    setEditingApplication({
      ...editingApplication,
      [name]: name === 'age_AP' ? Number(value) : value,
    });
  };

  /* ──────────────────────────────────────────────────────────
     Validación de campos
  ────────────────────────────────────────────────────────── */
  const validateFormFields = (): boolean => {
    if (!editingApplication) return false;

    const newErrors: Record<string, string> = {};

    /* ① Solicitante */
    const lettersRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const cedulaRegex = /^[A-Za-z0-9]{9,12}$/;          // 9-12 caracteres alfanuméricos
    const phoneRegex = /^\d{8}$/;                       // 8 dígitos

    // Nombre
    if (!editingApplication.name_AP.trim())
      newErrors.name_AP = 'El nombre es obligatorio';
    else if (!lettersRegex.test(editingApplication.name_AP) || editingApplication.name_AP.length < 3 || editingApplication.name_AP.length > 25)
      newErrors.name_AP = 'Nombre entre 3-25 caracteres, solo letras y espacios';

    // Apellido 1
    if (!editingApplication.lastName1_AP.trim())
      newErrors.lastName1_AP = 'El primer apellido es obligatorio';
    else if (!lettersRegex.test(editingApplication.lastName1_AP) || editingApplication.lastName1_AP.length < 3 || editingApplication.lastName1_AP.length > 25)
      newErrors.lastName1_AP = 'Primer apellido entre 3-25 caracteres, solo letras y espacios';

    // Apellido 2 (opcional)
    if (editingApplication.lastName2_AP?.trim() &&
        (!lettersRegex.test(editingApplication.lastName2_AP) || editingApplication.lastName2_AP.length < 3 || editingApplication.lastName2_AP.length > 25))
      newErrors.lastName2_AP = 'Segundo apellido entre 3-25 caracteres, solo letras y espacios';

    // Cédula
    if (!editingApplication.cedula_AP.trim())
      newErrors.cedula_AP = 'La cédula es obligatoria';
    else if (!cedulaRegex.test(editingApplication.cedula_AP))
      newErrors.cedula_AP = 'Cédula de 9-12 caracteres (letras y/o números)';

    // Edad
    if (editingApplication.age_AP === undefined || editingApplication.age_AP === null)
      newErrors.age_AP = 'La edad es obligatoria';
    else if (editingApplication.age_AP < 65 || editingApplication.age_AP > 120)
      newErrors.age_AP = 'La edad debe estar entre 65 y 120 años';

    // Domicilio
    if (!editingApplication.location_AP.trim() || editingApplication.location_AP.length < 5 || editingApplication.location_AP.length > 100)
      newErrors.location_AP = 'Domicilio entre 5-100 caracteres';

    /* ② Encargado */
    if (!editingApplication.guardianName.trim() || !lettersRegex.test(editingApplication.guardianName) || editingApplication.guardianName.length < 3)
      newErrors.guardianName = 'Nombre del encargado: mínimo 3 caracteres, solo letras y espacios';

    if (!editingApplication.guardianLastName1.trim() || !lettersRegex.test(editingApplication.guardianLastName1))
      newErrors.guardianLastName1 = 'Primer apellido del encargado solo letras y espacios';

    if (editingApplication.guardianLastName2?.trim() && !lettersRegex.test(editingApplication.guardianLastName2))
      newErrors.guardianLastName2 = 'Segundo apellido del encargado solo letras y espacios';

    if (!editingApplication.guardianCedula.trim() || !cedulaRegex.test(editingApplication.guardianCedula))
      newErrors.guardianCedula = 'Cédula del encargado de 9-12 caracteres alfanuméricos';

    if (!editingApplication.guardianPhone.trim() || !phoneRegex.test(editingApplication.guardianPhone))
      newErrors.guardianPhone = 'Teléfono del encargado: 8 dígitos';

    if (!editingApplication.guardianEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingApplication.guardianEmail))
      newErrors.guardianEmail = 'Formato de email inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ──────────────────────────────────────────────────────────
     Guardar
  ────────────────────────────────────────────────────────── */
  const handleSave = () => {
    if (editingApplication && validateFormFields()) onSave(editingApplication);
  };

  /* ──────────────────────────────────────────────────────────
     Render
  ────────────────────────────────────────────────────────── */
  return (
    <EditApplicationModalLayout
      isOpen={isOpen}
      title="Editar solicitud"
      onClose={() => {
        onClose();
        setErrors({});
      }}
      actions={
        <div className="flex space-x-4 justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            onClick={handleSave}
            disabled={isUpdating}
          >
            {isUpdating ? <LoadingSpinner /> : 'Guardar'}
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            onClick={() => {
              onClose();
              setErrors({});
            }}
          >
            Cancelar
          </button>
        </div>
      }
    >
      {editingApplication && (
        <>
          <FormField
            label="Nombre"
            name="name_AP"
            value={editingApplication.name_AP}
            onChange={handleInputChange}
            error={errors.name_AP}
            required
            className={isDarkMode ? 'bg-gray-700 text-white' : ''}
          />
          <FormField
            label="Primer apellido"
            name="lastName1_AP"
            value={editingApplication.lastName1_AP}
            onChange={handleInputChange}
            error={errors.lastName1_AP}
            required
            className={isDarkMode ? 'bg-gray-700 text-white' : ''}
          />
          <FormField
            label="Segundo apellido"
            name="lastName2_AP"
            value={editingApplication.lastName2_AP || ''}
            onChange={handleInputChange}
            error={errors.lastName2_AP}
            className={isDarkMode ? 'bg-gray-700 text-white' : ''}
          />
          <FormField
            label="Cédula"
            name="cedula_AP"
            value={editingApplication.cedula_AP}
            onChange={handleInputChange}
            error={errors.cedula_AP}
            required
            placeholder="9-12 caracteres alfanuméricos"
            className={isDarkMode ? 'bg-gray-700 text-white' : ''}
          />
          <FormField
            label="Edad"
            name="age_AP"
            type="number"
            value={String(editingApplication.age_AP)}
            onChange={handleInputChange}
            error={errors.age_AP}
            required
            className={isDarkMode ? 'bg-gray-700 text-white' : ''}
          />
          <FormField
            label="Domicilio"
            name="location_AP"
            value={editingApplication.location_AP}
            onChange={handleInputChange}
            error={errors.location_AP}
            required
            className={isDarkMode ? 'bg-gray-700 text-white' : ''}
          />
          {/* ─────────── Encargado ─────────── */}
          <FormField
            label="Nombre del encargado"
            name="guardianName"
            value={editingApplication.guardianName}
            onChange={handleInputChange}
            error={errors.guardianName}
            required
            className={isDarkMode ? 'bg-gray-700 text-white' : ''}
          />
          <FormField
            label="Primer apellido encargado"
            name="guardianLastName1"
            value={editingApplication.guardianLastName1}
            onChange={handleInputChange}
            error={errors.guardianLastName1}
            required
            className={isDarkMode ? 'bg-gray-700 text-white' : ''}
          />
          <FormField
            label="Segundo apellido encargado"
            name="guardianLastName2"
            value={editingApplication.guardianLastName2 || ''}
            onChange={handleInputChange}
            error={errors.guardianLastName2}
            className={isDarkMode ? 'bg-gray-700 text-white' : ''}
          />
          <FormField
            label="Cédula encargado"
            name="guardianCedula"
            value={editingApplication.guardianCedula}
            onChange={handleInputChange}
            error={errors.guardianCedula}
            required
            placeholder="9-12 caracteres alfanuméricos"
            className={isDarkMode ? 'bg-gray-700 text-white' : ''}
          />
          <FormField
            label="Teléfono del encargado"
            name="guardianPhone"
            value={editingApplication.guardianPhone}
            onChange={handleInputChange}
            error={errors.guardianPhone}
            required
            placeholder="8 dígitos"
            className={isDarkMode ? 'bg-gray-700 text-white' : ''}
          />
          <FormField
            label="Email del encargado"
            name="guardianEmail"
            type="email"
            value={editingApplication.guardianEmail}
            onChange={handleInputChange}
            error={errors.guardianEmail}
            required
            className={isDarkMode ? 'bg-gray-700 text-white' : ''}
          />
        </>
      )}
    </EditApplicationModalLayout>
  );
};

export default EditApplicationModal;
