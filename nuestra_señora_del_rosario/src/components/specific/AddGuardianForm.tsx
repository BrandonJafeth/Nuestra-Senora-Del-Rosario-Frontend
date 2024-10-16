import { useForm, SubmitHandler } from 'react-hook-form'; // Importamos React Hook Form
import { useGuardianMutation } from '../../hooks/useGuardian'; 
import { useToast } from '../../hooks/useToast'; 
import { Guardian } from '../../types/GuardianType'; 
import { useThemeDark } from '../../hooks/useThemeDark'; 
import Toast from '../common/Toast'; 

interface AddGuardianFormProps {
  setIsGuardianAdded: (added: boolean) => void;
  setGuardianId: (id: number | null) => void; 
}

// Definimos los tipos para el formulario
type GuardianFormInputs = {
  name_GD: string;
  lastname1_GD: string;
  lastname2_GD?: string; 
  cedula_GD: string;
  email_GD?: string;
  phone_GD: string;
};

function AddGuardianForm({ setIsGuardianAdded, setGuardianId }: AddGuardianFormProps) {
  const { mutate: saveGuardian, isLoading } = useGuardianMutation();
  const { showToast, message, type } = useToast(); 
  const { isDarkMode } = useThemeDark(); 

  // Hook para manejar el formulario con validaciones
  const { register, handleSubmit, formState: { errors } } = useForm<GuardianFormInputs>();

  // Manejo del envío del formulario
  const onSubmit: SubmitHandler<GuardianFormInputs> = (data) => {
    saveGuardian(data as Guardian, {
      onSuccess: (response) => {
        const id = response.data?.id_Guardian;
        if (id) {
          setGuardianId(id);
          setIsGuardianAdded(true);
          showToast('Guardián añadido exitosamente', 'success');
        } else {
          console.error('No se pudo obtener el ID del guardián.');
        }
      },
      onError: (error) => {
        console.error('Error al añadir el guardián:', error);
        showToast('Error al añadir el guardián. Revisa los datos ingresados', 'error');
      },
    });
  };

  return (
    <div
      className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${
        isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'
      }`}
    >
      <h2
        className={`text-3xl font-bold text-center mb-8 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}
      >
        Añadir Encargado
      </h2>

      {/* Formulario con React Hook Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
        {/* Nombre del guardián */}
        <div>
          <label className="block mb-2 text-lg">Nombre del Encargado</label>
          <input
            {...register('name_GD', { required: 'El nombre es obligatorio' })}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
          />
          {errors.name_GD && <p className="text-red-500">{errors.name_GD.message}</p>}
        </div>

        {/* Primer apellido del guardián */}
        <div>
          <label className="block mb-2 text-lg">Primer Apellido</label>
          <input
            {...register('lastname1_GD', { required: 'El primer apellido es obligatorio' })}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
          />
          {errors.lastname1_GD && <p className="text-red-500">{errors.lastname1_GD.message}</p>}
        </div>

        {/* Segundo apellido del guardián */}
        <div>
          <label className="block mb-2 text-lg">Segundo Apellido</label>
          <input
            {...register('lastname2_GD')}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
          />
        </div>

        {/* Cédula del guardián */}
        <div>
          <label className="block mb-2 text-lg">Cédula</label>
          <input
            {...register('cedula_GD', { required: 'La cédula es obligatoria' })}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
          />
          {errors.cedula_GD && <p className="text-red-500">{errors.cedula_GD.message}</p>}
        </div>

        {/* Correo electrónico del guardián */}
        <div>
          <label className="block mb-2 text-lg">Correo Electrónico</label>
          <input
            {...register('email_GD', {
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Correo no válido',
              },
            })}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
          />
          {errors.email_GD && <p className="text-red-500">{errors.email_GD.message}</p>}
        </div>

        {/* Teléfono del guardián */}
        <div>
          <label className="block mb-2 text-lg">Teléfono</label>
          <input
            {...register('phone_GD', { required: 'El teléfono es obligatorio' })}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
          />
          {errors.phone_GD && <p className="text-red-500">{errors.phone_GD.message}</p>}
        </div>

        {/* Botones de guardar */}
        <div className="col-span-2 flex justify-center space-x-4 mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-7 py-4 rounded-lg shadow-lg transition duration-200 ${
              isLoading ? 'bg-gray-400' : isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isLoading ? 'Guardando...' : 'Guardar Encargado'}
          </button>
        </div>
      </form>

      {/* Toast para mostrar mensajes */}
      <Toast message={message} type={type} />
    </div>
  );
}

export default AddGuardianForm;
