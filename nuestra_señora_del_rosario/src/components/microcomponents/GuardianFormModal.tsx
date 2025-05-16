import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useThemeDark } from '../../hooks/useThemeDark';
import { Guardian } from '../../types/GuardianType';
import { useGuardianMutation } from '../../hooks/useGuardian';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Guardian;
}

Modal.setAppElement('#root');

type GuardianFormInputs = {
  name_GD: string;
  lastname1_GD: string;
  lastname2_GD: string;
  cedula_GD: string;
  email_GD: string;
  phone_GD: string;
};

const GuardianFormModal: React.FC<Props> = ({ isOpen, onClose, initialData }) => {
  const { isDarkMode } = useThemeDark();
  const mutation = useGuardianMutation();
  const {showToast, message, type} = useToast() // Assuming you have a custom hook for toasts
  const { register, handleSubmit, reset, formState: { errors } } = useForm<GuardianFormInputs>({
    defaultValues: {
      name_GD: '',
      lastname1_GD: '',
      lastname2_GD: '',
      cedula_GD: '',
      email_GD: '',
      phone_GD: ''
    }
  });

  // Si initialData viene, reinicia el formulario con esos valores (para editar)
  useEffect(() => {
    if (initialData) {
      reset({
        name_GD: initialData.name_GD,
        lastname1_GD: initialData.lastname1_GD,
        lastname2_GD: initialData.lastname2_GD,
        cedula_GD: initialData.cedula_GD,
        email_GD: initialData.email_GD,
        phone_GD: initialData.phone_GD
      });
    } else {
      reset();
    }
  }, [initialData, reset]);

    const onSubmit: SubmitHandler<GuardianFormInputs> = data => {
    // Always include id_Guardian (use 0 for new Guardian)
    const payload = {
      ...data,
      id_Guardian: initialData ? initialData.id_Guardian : 0
    };
    mutation.mutate(payload, {
      onSuccess: () => {
        showToast('Encargado creado exitosamente', 'success');
        onClose();
      },
      onError: () => {
        showToast('Error al crear el encargado', 'error');
      }
    });
  };

  return (
    <>
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                  p-6 rounded-lg max-w-2xl mx-auto mt-20`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-2xl font-bold mb-4">
        {initialData ? 'Editar Encargado' : 'Nuevo Encargado'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
        <div className="flex flex-col">
         <label className="mb-1">Nombre</label>
    <input
      type="text"
      {...register('name_GD', { 
        required: 'El nombre es obligatorio', 
        maxLength: { value: 25, message: 'Máximo 25 caracteres' },
        pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s']+$/, message: 'Solo se permiten letras, espacios y apóstrofes' }
      })}
      className="p-2 border rounded"
    />
    {errors.name_GD && <span className="text-red-500 text-sm">{errors.name_GD.message}</span>}
    </div>

        <div className="flex flex-col">
          <label className="mb-1">Primer Apellido</label>
    <input
      type="text"
      {...register('lastname1_GD', { 
        required: 'El primer apellido es obligatorio', 
        maxLength: { value: 25, message: 'Máximo 25 caracteres' },
        pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s']+$/, message: 'Solo se permiten letras, espacios y apóstrofes' }
      })}
      className="p-2 border rounded"
    />
    {errors.lastname1_GD && <span className="text-red-500 text-sm">{errors.lastname1_GD.message}</span>}
  </div>

        <div className="flex flex-col">
          <label className="mb-1">Segundo Apellido</label>
    <input
      type="text"
      {...register('lastname2_GD', { 
        required: 'El segundo apellido es obligatorio', 
        maxLength: { value: 25, message: 'Máximo 25 caracteres' },
        pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s']+$/, message: 'Solo se permiten letras, espacios y apóstrofes' }
      })}
      className="p-2 border rounded"
    />
    {errors.lastname2_GD && <span className="text-red-500 text-sm">{errors.lastname2_GD.message}</span>}
   </div>

        <div className="flex flex-col">
          <label className="mb-1">Cédula</label>
          <input
            type="text"
            {...register('cedula_GD', {
              required: 'La cédula es obligatoria',
              maxLength: { value: 9, message: 'Debe contener 9 caracteres' },
              minLength: { value: 9, message: 'Debe contener 9 caracteres' },
              pattern: { value: /^\d+$/, message: 'Debe contener solo números' }
            })}
            className="p-2 border rounded"
          />
          {errors.cedula_GD && <span className="text-red-500 text-sm">{errors.cedula_GD.message}</span>}
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Email</label>
          <input
            type="email"
            {...register('email_GD', {
              required: 'El email es obligatorio',
              pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Correo no válido' }
            })}
            placeholder="ejemplo@gmail.com"
            className="p-2 border rounded"
          />
          {errors.email_GD && <span className="text-red-500 text-sm">{errors.email_GD.message}</span>}
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Teléfono</label>
          <input
            type="text"
            {...register('phone_GD', {
              required: 'El teléfono es obligatorio',
              maxLength: { value: 8, message: 'Debe contener 8 caracteres' },
              minLength: { value: 8, message: 'Debe contener 8 caracteres' },
              pattern: { value: /^\d+$/, message: 'Debe contener solo números' }
            })}
            className="p-2 border rounded"
          />
          {errors.phone_GD && <span className="text-red-500 text-sm">{errors.phone_GD.message}</span>}
        </div>

        <div className="col-span-2 flex justify-end space-x-4">
          <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
            Guardar
          </button>
          <button type="button" onClick={onClose} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  <Toast message={message} type={type} />
      </>
  );
};

export default GuardianFormModal;