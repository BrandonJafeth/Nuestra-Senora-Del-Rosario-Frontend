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
  lastname2_GD: string;
  email_GD: string;
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
  const [, setSelectedGuardian] = useState<Guardian | null>(null);

  // Cargar guardianes
  useEffect(() => {
    (async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) throw new Error('No auth token');
        const res = await fetch('https://wg04c4oosck8440w4cg8g08o.nuestrasenora.me/api/Guardian', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: Guardian[] = await res.json();
        setGuardians(data);
      } catch {
        showToast('Error al cargar los guardianes.', 'error');
      }
    })();
  }, [showToast]);

  const handleSearchByName = (name: string) => {
    setFilteredGuardians(
      guardians.filter(g =>
        `${g.name_GD} ${g.lastname1_GD} ${g.lastname2_GD}`
          .toLowerCase().includes(name.toLowerCase())
      )
    );
  };

  const handleSelectGuardian = (guardian: Guardian) => {
    const fullName = `${guardian.name_GD} ${guardian.lastname1_GD} ${guardian.lastname2_GD}`;
    setValue('name_GD', fullName);
    setSelectedGuardian(guardian);
    setGuardianId(guardian.id_Guardian);
    setFilteredGuardians([]);
    showToast(`Encargado seleccionado: ${fullName}`, 'success');
    setTimeout(() => setIsGuardianAdded(true), 3000);
  };

  const onSubmit: SubmitHandler<GuardianFormInputs> = data => {
    saveGuardian(data as any, {
      onSuccess: res => {
        const id = res.data?.id_Guardian;
        if (id) {
          setGuardianId(id);
          setIsGuardianAdded(true);
          showToast('Guardián añadido exitosamente', 'success');
          setTimeout(() => setIsGuardianAdded(true), 3000);
        }
      },
      onError: () => showToast('Error al guardar el guardián.', 'error'),
    });
  };

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${
      isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'
    }`}>
      <h2 className={`text-3xl font-bold text-center mb-8 ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      }`}>
        {isNewGuardian ? 'Añadir encargado' : 'Buscar encargado'}
      </h2>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setIsNewGuardian(false)}
          className={`px-4 py-2 rounded-lg text-white ${
            isNewGuardian ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          Buscar encargado
        </button>
        <button
          onClick={() => {
            reset();
            setIsNewGuardian(true);
            setFilteredGuardians([]);
          }}
          className={`px-4 py-2 rounded-lg text-white ${
            isNewGuardian ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500'
          }`}
        >
          Nuevo encargado
        </button>
      </div>

      {!isNewGuardian ? (
        <div className="mb-6">
          <label className="block mb-2 text-lg">Nombre del encargado</label>
          <input
            type="text"
            {...register('name_GD')}
            className={`w-full p-3 rounded-md ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'
            }`}
            onChange={e => handleSearchByName(e.target.value)}
          />

          {filteredGuardians.length > 0 && (
            <ul className="mt-2 border rounded-md bg-white shadow-md max-h-48 overflow-y-auto">
              {filteredGuardians.map(g => (
                <li
                  key={g.id_Guardian}
                  onClick={() => handleSelectGuardian(g)}
                  className="p-2 text-black hover:bg-gray-100 cursor-pointer"
                >
                  {g.name_GD} {g.lastname1_GD} {g.lastname2_GD} {g.cedula_GD}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
          {/* Campos con validaciones reforzadas */}
          <div>
            <label className="block mb-2 text-lg">Nombre del encargado</label>
            <input
              {...register('name_GD', {
                required: 'El nombre es obligatorio',
                maxLength: { value: 25, message: 'Máximo 25 caracteres' },
                pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, message: 'Solo letras y espacios' }
              })}
              className={`w-full p-3 rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'
              }`}
            />
            {errors.name_GD && <p className="text-red-500">{errors.name_GD.message}</p>}
          </div>

          <div>
            <label className="block mb-2 text-lg">Primer apellido</label>
            <input
              {...register('lastname1_GD', {
                required: 'El primer apellido es obligatorio',
                maxLength: { value: 25, message: 'Máximo 25 caracteres' },
                pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, message: 'Solo letras y espacios' }
              })}
              className={`w-full p-3 rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'
              }`}
            />
            {errors.lastname1_GD && <p className="text-red-500">{errors.lastname1_GD.message}</p>}
          </div>

          <div>
            <label className="block mb-2 text-lg">Segundo apellido</label>
            <input
              {...register('lastname2_GD', {
                required: 'El segundo apellido es obligatorio',
                maxLength: { value: 25, message: 'Máximo 25 caracteres' },
                pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, message: 'Solo letras y espacios' }
              })}
              className={`w-full p-3 rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'
              }`}
            />
            {errors.lastname2_GD && <p className="text-red-500">{errors.lastname2_GD.message}</p>}
          </div>

          <div>
            <label className="block mb-2 text-lg">Cédula</label>
            <input
  {...register('cedula_GD', {
    required: 'La cédula es obligatoria',
    maxLength: { value: 9, message: 'Debe contener 9 caracteres' },
    minLength: { value: 9, message: 'Debe contener 9 caracteres' },
    pattern: { value: /^\d+$/, message: 'Debe contener solo números' }
  })}
  className={`w-full p-3 rounded-md ${
    isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'
  }`}
/>
            {errors.cedula_GD && <p className="text-red-500">{errors.cedula_GD.message}</p>}
          </div>

          <div>
            <label className="block mb-2 text-lg">Correo Electrónico</label>
            <input
              {...register('email_GD', {
                required: 'El email es obligatorio',
                pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Correo no válido' }
              })}
              className={`w-full p-3 rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'
              }`}
              placeholder='Ejemplo: example@gmail.com'
            />
            {errors.email_GD && <p className="text-red-500">{errors.email_GD.message}</p>}
          </div>

          <div>
            <label className="block mb-2 text-lg">Teléfono</label>
            <input
              {...register('phone_GD', { required: 'El teléfono es obligatorio' })}
              className={`w-full p-3 rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'
              }`}
            />
            {errors.phone_GD && <p className="text-red-500">{errors.phone_GD.message}</p>}
          </div>

          <button
            type="submit"
            className="col-span-2 px-7 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mx-auto block"
          >
            Guardar encargado
          </button>
        </form>
      )}

      <Toast message={message} type={type} />
    </div>
  );
}

export default AddGuardianForm;
