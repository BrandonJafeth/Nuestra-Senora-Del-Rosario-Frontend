// src/components/GuardianEditModal.tsx
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useThemeDark } from '../../hooks/useThemeDark';
import { Guardian } from '../../types/GuardianType';
import { useUpdateGuardianPut } from '../../hooks/useUpdateGuardianPut';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  guardian: Guardian;
}

type FormInputs = Omit<Guardian, 'id_Guardian'>;

Modal.setAppElement('#root');

const GuardianEditModal: React.FC<Props> = ({ isOpen, onClose, guardian }) => {
  const { isDarkMode } = useThemeDark();
  const { showToast, message, type } = useToast();
  const updateMutation = useUpdateGuardianPut();
  const [isEditing, setIsEditing] = useState(false);

  // Activamos validación onChange para trackear isValid
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid }
  } = useForm<FormInputs>({
    defaultValues: {
      cedula_GD: guardian.cedula_GD,
      name_GD: guardian.name_GD,
      lastname1_GD: guardian.lastname1_GD,
      lastname2_GD: guardian.lastname2_GD,
      email_GD: guardian.email_GD,
      phone_GD: guardian.phone_GD
    },
    mode: 'onChange'
  });

  // Resetea el form y sale de edición al abrir/cerrar o cambiar guardian
  useEffect(() => {
    reset({
      cedula_GD: guardian.cedula_GD,
      name_GD: guardian.name_GD,
      lastname1_GD: guardian.lastname1_GD,
      lastname2_GD: guardian.lastname2_GD,
      email_GD: guardian.email_GD,
      phone_GD: guardian.phone_GD
    });
    setIsEditing(false);
  }, [guardian, reset, isOpen]);
  const onSubmit: SubmitHandler<FormInputs> = data => {
    const payload = { ...data, id_Guardian: guardian.id_Guardian };
    updateMutation.mutate(
      { id: guardian.id_Guardian, data: payload },
      {
        onSuccess: () => {
          showToast('Encargado actualizado exitosamente', 'success');
          // Pequeña demora antes de cerrar para asegurar que el toast sea visible
          setTimeout(() => {
            setIsEditing(false);
            onClose();
          }, 1000);
        },
        onError: () => showToast('Error al actualizar el encargado', 'error')
      }
    );
  };

  return (
<Modal
      isOpen={isOpen}
      onRequestClose={() => { setIsEditing(false); onClose(); }}
      className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                  p-6 rounded-lg max-w-2xl mx-auto mt-20 z-50`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
      style={{
        overlay: { zIndex: 1000 },
        content: { zIndex: 1001 }
      }}
    >
      <h2 className="text-2xl font-bold mb-4">Detalle Encargado</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
        {([
          { name: 'cedula_GD',     label: 'Cédula' },
          { name: 'name_GD',       label: 'Nombre' },
          { name: 'lastname1_GD',  label: 'Apellido 1' },
          { name: 'lastname2_GD',  label: 'Apellido 2' },
          { name: 'email_GD',      label: 'Email' },
          { name: 'phone_GD',      label: 'Teléfono' },
        ] as const).map(({ name, label }) => (
          <div key={name} className="flex flex-col">
            <label className="mb-1 font-medium">{label}</label>
            {isEditing ? (              <input
                type="text"
                {...register(name, {
                  required: `${label} es obligatorio`,
                  // Validaciones extra si lo deseas:
                  ...(name === 'email_GD' && {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Email no válido'
                    }
                  }),
                  ...(name === 'phone_GD' && {
                    minLength: { value: 8, message: 'Debe tener 8 dígitos' },
                    maxLength: { value: 8, message: 'Debe tener 8 dígitos' },
                    pattern: { value: /^\d+$/, message: 'Solo números' }
                  })
                })}
                className={`w-full p-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${isDarkMode ? 'text-black' : ''}`}
              />            ) : (
              <p className={`p-3 w-full rounded-md border border-gray-300 bg-gray-50 ${isDarkMode ? 'text-black' : ''}`}>
                {(guardian as any)[name]}
              </p>
            )}
            {isEditing && errors[name] && (
              <span className="text-red-500 text-sm">{errors[name]?.message}</span>
            )}
          </div>
        ))}
      </form>

      <div className="mt-8 flex justify-center space-x-4">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Editar
          </button>
        ) : (
          <button
            type="submit"
            onClick={() => handleSubmit(onSubmit)()}
            disabled={!isDirty || !isValid || updateMutation.isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            {updateMutation.isLoading ? 'Guardando...' : 'Guardar'}
          </button>
        )}
        <button
          onClick={() => { setIsEditing(false); onClose(); }}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Cerrar
        </button>
      </div>
      
      {/* Toast con z-index alto para asegurar que se muestre correctamente */}
      <div className="z-[9999] fixed bottom-4 right-4">
        <Toast message={message} type={type} />
      </div>
    </Modal>
  );
};

export default GuardianEditModal;
