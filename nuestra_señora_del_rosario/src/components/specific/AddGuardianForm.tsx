import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useGuardianMutation } from '../../hooks/useGuardian'; 
import { useToast } from '../../hooks/useToast'; 
import { useThemeDark } from '../../hooks/useThemeDark'; 
import Toast from '../common/Toast'; 
import Cookies from 'js-cookie';
import { Guardian } from '../../types/GuardianType';

interface AddGuardianFormProps {
  setIsGuardianAdded: (added: boolean) => void;
  setGuardianId: (id: number | null) => void;
}

type GuardianFormInputs = {
  cedula_GD: string;
  name_GD: string;
  lastname1_GD: string;
  lastname2_GD?: string;
  email_GD?: string;
  phone_GD: string;
};

function AddGuardianForm({ setIsGuardianAdded, setGuardianId }: AddGuardianFormProps) {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<GuardianFormInputs>();
  const { showToast, message, type } = useToast(); 
  const { isDarkMode } = useThemeDark();
  const { mutate: saveGuardian } = useGuardianMutation();

  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [filteredGuardians, setFilteredGuardians] = useState<Guardian[]>([]);
  const [isNewGuardian, setIsNewGuardian] = useState(false);
  const [, setSelectedGuardian] = useState<Guardian | null>(null); // Estado para el guardián seleccionado

  // Cargar guardianes al montar el componente
  useEffect(() => {
    const fetchGuardians = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) throw new Error('No se encontró un token de autenticación');
        const response = await fetch('https://wg04c4oosck8440w4cg8g08o.nuestrasenora.me/api/Guardian', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setGuardians(data);
      } catch (error) {
        console.error('Error al cargar los guardianes:', error);
        showToast('Error al cargar los guardianes.', 'error');
      }
    };

    fetchGuardians();
  }, [showToast]);
  // Filtrar guardianes mientras el usuario escribe
  const handleSearchByName = (name: string) => {
    const filtered = guardians.filter(g => 
      `${g.name_GD} ${g.lastname1_GD} ${g.lastname2_GD || ''}`
        .toLowerCase()
        .includes(name.toLowerCase())
    );
    setFilteredGuardians(filtered);
  };

  const handleSelectGuardian = (guardian: Guardian) => {
    const fullName = `${guardian.name_GD} ${guardian.lastname1_GD} ${guardian.lastname2_GD || ''}`;
  
    setValue('name_GD', fullName);
    setSelectedGuardian(guardian);
    setGuardianId(guardian.id_Guardian);
  
    // Limpiar sugerencias y cerrar la pantalla
    setFilteredGuardians([]);
  
    // Mostrar toast con el nombre del encargado seleccionado
    showToast(`Encargado seleccionado: ${fullName}`, 'success');
  
    // Mostrar el toast por 2 segundos y luego continuar
    setTimeout(() => setIsGuardianAdded(true), 3000);
  };
  

  // Manejo del envío del formulario (creación)
  const onSubmit: SubmitHandler<GuardianFormInputs> = (data) => {
    saveGuardian(data as Guardian, {
      onSuccess: (response) => {
        const id = response.data?.id_Guardian;
        if (id) {
          setGuardianId(id);
          setIsGuardianAdded(true);
          showToast('Guardián añadido exitosamente', 'success');
          setTimeout(() => setIsGuardianAdded(true), 3000);
        }
      },
      onError: (error) => {
        console.error('Error al guardar el guardián:', error);
        showToast('Error al guardar el guardián.', 'error');
      },
    });
  };

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'}`}>
      <h2 className={`text-3xl font-bold text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        {isNewGuardian ? 'Añadir Encargado' : 'Buscar Encargado'}
      </h2>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setIsNewGuardian(false)}
          className={`px-4 py-2 rounded-lg text-white ${isNewGuardian ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          Buscar Encargado
        </button>
        <button
          onClick={() => {
            reset(); 
            setIsNewGuardian(true);
            setFilteredGuardians([]);
          }}
          className={`px-4 py-2 rounded-lg text-white ${isNewGuardian ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500'}`}
        >
          Nuevo Encargado
        </button>
      </div>

      {!isNewGuardian ? (
        <div className="mb-6">
          <label className="block mb-2 text-lg">Nombre del Encargado</label>
          <input
            type="text"
            {...register('name_GD')}
            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            onChange={(e) => handleSearchByName(e.target.value)}
          />

{filteredGuardians.length > 0 && (
  <ul className="mt-2 border rounded-md bg-white shadow-md max-h-48 overflow-y-auto">
    {filteredGuardians.map((guardian) => (
      <li
        key={guardian.id_Guardian}
        onClick={() => handleSelectGuardian(guardian)}
        className="p-2 text-black hover:bg-gray-100 cursor-pointer"
      >
        {guardian.name_GD} {guardian.lastname1_GD} {guardian.lastname2_GD} {guardian.cedula_GD}
      </li>
    ))}
  </ul>
)}

        </div>
      ) : (
        // Formulario de creación de nuevo encargado
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
          {/* Campos del formulario */}
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
          {/* Más campos... */}
          <button
  type="submit"
  className="col-span-2 px-7 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mx-auto block"
>
  Guardar Encargado
</button>
</form>
      )}

      <Toast message={message} type={type} />
    </div>
  );
}

export default AddGuardianForm;
