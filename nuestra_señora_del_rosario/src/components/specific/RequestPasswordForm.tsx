import { useRequestsPassword } from '../../hooks/useRequestsPassword';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import Toast from '../common/Toast';
import { useForm } from 'react-hook-form';

function RequestPasswordForm() {
  const { requestPasswordMutation, message, type, handleCancel } = useRequestsPassword();
  const { isLoading } = requestPasswordMutation;

  // Inicializa useForm para manejar el formulario
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',  // Valor inicial del campo "email"
    },
  });

  // Función que se ejecutará al enviar el formulario
  const onSubmit = (data: { email: string }) => {
    requestPasswordMutation.mutate(data.email);
  };

  return (
    <div className="w-full max-w-md p-8 mx-auto bg-white dark:bg-[#0f1728] shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">Solicitar restablecimiento</h2>
      <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-8">
        Por favor, ingrese su correo electrónico para recibir un enlace de restablecimiento de contraseña.
      </p>

      {/* Formulario controlado por React Hook Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
        <div className="w-full">
          <label htmlFor="email" className="block text-gray-900 dark:text-white mb-2">Correo Electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="Ingrese su correo electrónico"
            className={`w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md border ${
              errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            {...register('email', {
              required: 'El correo electrónico es requerido.',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'El correo electrónico no es válido.',
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
          )}
        </div>

        {/* Botones fuera del form */}
        <div className="flex space-x-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-red-600 text-white text-lg font-medium rounded-md shadow-md transition-transform transform hover:scale-105 hover:bg-red-700"
            tabIndex={1}
          >
            Cancelar
          </button>

          <button
            type="submit" // Cambiado a "submit" ya que está dentro del form
            tabIndex={0}
            className={`flex-1 px-4 py-2 bg-blue-600 text-white text-lg font-medium rounded-md shadow-md transition-transform transform hover:scale-105 hover:bg-blue-700 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : 'Enviar enlace de restablecimiento'}
          </button>
        </div>
      </form>

      {/* Componente Toast para mostrar los mensajes */}
      <Toast message={message} type={type} />
    </div>
  );
}

export default RequestPasswordForm;
