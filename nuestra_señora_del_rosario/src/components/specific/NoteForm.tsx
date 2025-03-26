import { useForm, SubmitHandler } from 'react-hook-form';
import { NoteRequest } from '../../types/NoteTypes';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
import { useManagmentNote } from '../../hooks/useManagmentNote';

const NoteForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NoteRequest>();
  const {createEntity} = useManagmentNote();
const {showToast, message, type} = useToast();

  // Manejador del envío del formulario
  const onSubmit: SubmitHandler<NoteRequest> = (data) => {
    createEntity.mutate(data, {
      onSuccess: () => {
        reset(); // Limpiar formulario tras éxito
      showToast('Nota creada exitosamente', 'success');
      },
      onError: (error: any) => {
        console.error('Error al crear la nota:', error);
        showToast('Error al crear la nota.', 'error');
      },
    });
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Agregar Nota
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        {/* Razón */}
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Motivo de la nota:
          </label>
          <input
            type="text"
            id="reason"
            {...register('reason', { required: 'La razón es obligatoria.' })}
            className={`mt-1 w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.reason ? 'border-red-500' : ''
            }`}
            placeholder="Ingresa el motivo"
          />
          {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>}
        </div>

        {/* Fecha */}
<div>
  <label htmlFor="noteDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Fecha:
  </label>
  <input
    type="date"
    id="noteDate"
    {...register('noteDate', { required: 'La fecha es obligatoria.' })}
    min={new Date().toISOString().split('T')[0]} // Bloquea fechas anteriores a hoy
    className={`mt-1 w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
      errors.noteDate ? 'border-red-500' : ''
    }`}
  />
  {errors.noteDate && <p className="text-red-500 text-sm mt-1">{errors.noteDate.message}</p>}
</div>


        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Descripción:
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description', { required: 'La descripción es obligatoria.' })}
            className={`mt-1 w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none ${
              errors.description ? 'border-red-500' : ''
            }`}
            placeholder="Escribe la descripción de la nota"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="submit"
            disabled={createEntity.isLoading}
            className={`px-4 py-2 rounded-lg text-white ${
              createEntity.isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition`}
          >
            {createEntity.isLoading ? <LoadingSpinner /> : 'Guardar'}
          </button>
        </div>
      </form>
      <Toast message={message} type={type} />
    </div>
  );
};

export default NoteForm;
