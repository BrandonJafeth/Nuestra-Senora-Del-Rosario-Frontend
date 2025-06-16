import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useThemeDark } from '../../hooks/useThemeDark';
import { Guardian } from '../../types/GuardianType';
import { useGuardianMutation } from '../../hooks/useGuardian';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
import { useFetchGuardianInfo } from '../../hooks/useFetchGuardianInfo';
import { useVerifyCedula } from '../../hooks/useVerifyCedula';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Guardian;
}

Modal.setAppElement('#root');

type GuardianFormInputs = {
  cedula_GD: string;
  name_GD: string;
  lastname1_GD: string;
  lastname2_GD: string;
  email_GD: string;
  phone_GD: string;
};

const capitalize = (str?: string) =>
  str ? str.toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase()) : '';

const GuardianFormModal: React.FC<Props> = ({ isOpen, onClose, initialData }) => {
  const { isDarkMode } = useThemeDark();
  const mutation = useGuardianMutation();
  const { showToast, message, type } = useToast();
  const { isLoading: loading } = mutation;

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } =
    useForm<GuardianFormInputs>({
      defaultValues: {
        cedula_GD: '',
        name_GD: '',
        lastname1_GD: '',
        lastname2_GD: '',
        email_GD: '',
        phone_GD: ''
      }
    });

  // 1) Cuando cambie initialData, reset form para edición
  useEffect(() => {
    if (initialData) {
      reset({
        cedula_GD: initialData.cedula_GD,
        name_GD: initialData.name_GD,
        lastname1_GD: initialData.lastname1_GD,
        lastname2_GD: initialData.lastname2_GD,
        email_GD: initialData.email_GD,
        phone_GD: initialData.phone_GD
      });
    } else {
      reset();
    }
  }, [initialData, reset]);

  // 2) Disparar API al cambiar cédula
  const cedulaValue = watch('cedula_GD');

  // Hook que verifica si la cédula ya existe en el sistema
  const { data: verifyData, isFetching: verifyingCedula } = useVerifyCedula(cedulaValue);

  // Mostrar toast si la cédula ya existe (según verificación)
  useEffect(() => {
    if (verifyData && verifyData.exists) {
      showToast('La cédula ya se encuentra registrada en el sistema', 'error');
    }
  }, [verifyData, showToast]);

  // Obtener datos externos para autocompletar (solo si no existe en el sistema)
  const { data: guardianInfo } = useFetchGuardianInfo(cedulaValue, {
    enabled: cedulaValue.trim().length === 9 && !(verifyData && verifyData.exists)
  });

// 3) Si llega info, rellenar nombre y apellidos solo si la cédula NO existe
useEffect(() => {
  if (!verifyData?.exists && guardianInfo?.results?.length) {
    const person = guardianInfo.results[0];
    setValue('name_GD', capitalize(person.firstname));
    setValue('lastname1_GD', capitalize(person.lastname1));
    setValue('lastname2_GD', capitalize(person.lastname2));
  }
}, [guardianInfo, verifyData, setValue]);

  // Nuevo useEffect: limpiar el formulario cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<GuardianFormInputs> = data => {
    const payload: Guardian = {
      ...data,
      id_Guardian: initialData?.id_Guardian ?? 0
    };
    mutation.mutate(payload, {
      onSuccess: () => {
        showToast(
          initialData ? 'Encargado actualizado exitosamente' : 'Encargado creado exitosamente',
          'success'
        );
        onClose();
      },
      onError: () => showToast('Error al guardar el encargado', 'error')
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                    p-6 rounded-lg max-w-2xl mx-auto mt-20`}
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <h2 className="text-2xl font-bold mb-4">
          {initialData ? 'Editar Encargado' : 'Nuevo Encargado'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
          {/* Cédula */}
          <div>
            <label className="block mb-2">Cédula</label>
            <div className="relative">
              <input
                type="text"
                {...register('cedula_GD', {
                  required: 'La cédula es obligatoria',
                  minLength: { value: 9, message: 'Debe tener 9 dígitos' },
                  maxLength: { value: 9, message: 'Debe tener 9 dígitos' },
                  pattern: { value: /^\d+$/, message: 'Solo números' }
                })}
                className="w-full p-3 dark:text-black rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {verifyingCedula && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <LoadingSpinner />
                </span>
              )}
            </div>
            {errors.cedula_GD && (
              <p className="text-red-500">{errors.cedula_GD.message}</p>
            )}
          </div>
          {/* Nombre */}
          <div>
            <label className="block mb-2">Nombre</label>
            <input
              type="text"
              {...register('name_GD', { required: 'El nombre es obligatorio' })}
              className="w-full p-3 rounded-md dark:text-black border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.name_GD && <p className="text-red-500">{errors.name_GD.message}</p>}
          </div>
          {/* Apellido 1 */}
          <div>
            <label className="block mb-2">Primer Apellido</label>
            <input
              type="text"
              {...register('lastname1_GD', { required: 'El apellido es obligatorio' })}
              className="w-full p-3 rounded-md dark:text-black border dark:text-balck border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.lastname1_GD && (
              <p className="text-red-500">{errors.lastname1_GD.message}</p>
            )}
          </div>
          {/* Apellido 2 */}
          <div>
            <label className="block mb-2">Segundo Apellido</label>
            <input
              type="text"
              {...register('lastname2_GD', { required: 'El apellido es obligatorio' })}
              className="w-full p-3 rounded-md border dark:text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.lastname2_GD && (
              <p className="text-red-500">{errors.lastname2_GD.message}</p>
            )}
          </div>
          {/* Email */}
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              {...register('email_GD', {
                required: 'El email es obligatorio',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Correo no válido'
                }
              })}
              className="w-full p-3 rounded-md dark:text-black border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.email_GD && (
              <p className="text-red-500">{errors.email_GD.message}</p>
            )}
          </div>
          {/* Teléfono */}
          <div>
            <label className="block mb-2">Teléfono</label>
            <input
              type="text"
              {...register('phone_GD', {
                required: 'El teléfono es obligatorio',
                minLength: { value: 8, message: '8 dígitos' },
                maxLength: { value: 8, message: '8 dígitos' },
                pattern: { value: /^\d+$/, message: 'Solo números' }
              })}
              className="w-full p-3 rounded-md border dark:text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.phone_GD && (
              <p className="text-red-500">{errors.phone_GD.message}</p>
            )}
          </div>
          {/* Botones */}
          <div className="col-span-2 flex justify-end space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner /> : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
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