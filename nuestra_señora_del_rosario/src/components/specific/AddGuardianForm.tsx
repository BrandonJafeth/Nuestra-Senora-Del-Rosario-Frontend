import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useGuardianMutation } from '../../hooks/useGuardian'; 
import { useToast } from '../../hooks/useToast'; 
import { useThemeDark } from '../../hooks/useThemeDark'; 
import Toast from '../common/Toast'; 
import Cookies from 'js-cookie';
import { Guardian } from '../../types/GuardianType';
import { useFetchGuardianInfo } from '../../hooks/useFetchGuardianInfo';
import { useVerifyCedula } from '../../hooks/useVerifyCedula';

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

const capitalize = (str?: string) => {
  if (!str) return '';
  return str.toLowerCase().replace(/(^|\s)\S/g, (l) => l.toUpperCase());
};


function AddGuardianForm({ setIsGuardianAdded, setGuardianId }: AddGuardianFormProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<GuardianFormInputs>({ defaultValues: { cedula_GD: '' }});
  const { showToast, message, type } = useToast(); 
  const { isDarkMode } = useThemeDark();
  const { mutate: saveGuardian } = useGuardianMutation();

  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [filteredGuardians, setFilteredGuardians] = useState<Guardian[]>([]);
  const [isNewGuardian, setIsNewGuardian] = useState(false);
  const [, setSelectedGuardian] = useState<Guardian | null>(null);

  const cedula = watch('cedula_GD')

  const [debouncedCedula, setDebouncedCedula] = useState(cedula);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCedula(cedula);
    }, 500);
    return () => clearTimeout(handler);
  }, [cedula]);

 const {
    data: cedulaCheck,
    isFetching: isVerifying,
  } = useVerifyCedula(debouncedCedula)

  // 2) Traer datos de la API externa *solo si* la cédula NO existe
  const { data: guardianData } = useFetchGuardianInfo(debouncedCedula, {
    enabled: !!debouncedCedula && debouncedCedula.length === 9 && cedulaCheck?.exists === false
  });

   useEffect(() => {
    if (cedulaCheck?.exists) {
      const trad: Record<string,string> = {
        Employee: 'Empleado',
        Resident: 'Residente',
        Guardian: 'Encargado'
      }
      const where = cedulaCheck.entities
        .filter(e => e.existsInEntity)
        .map(e => `${trad[e.entityName] || e.entityName}${e.displayName ? ` (${e.displayName})` : ''}`)
        .join(', ')
      showToast(`La cédula ya existe en: ${where}`, 'error')
    }
  }, [cedulaCheck, showToast])

// dentro de AddGuardianForm

// Efecto 0: limpiar campos si la cédula cambia y ya no es de 9 dígitos
useEffect(() => {
  if (!debouncedCedula || debouncedCedula.length !== 9) {
    setValue('name_GD', '')
    setValue('lastname1_GD', '')
    setValue('lastname2_GD', '')
  }
}, [debouncedCedula, setValue])

// Efecto 1: autocompletar solo si cedulaCheck.exists === false y hay datos
useEffect(() => {
  const results = guardianData?.results
  if (!cedulaCheck?.exists && results?.length) {
    const p = results[0]
    setValue('name_GD', capitalize(p.firstname))
    setValue('lastname1_GD', capitalize(p.lastname1))
    setValue('lastname2_GD', capitalize(p.lastname2))
  }
}, [cedulaCheck, guardianData, setValue])


  // Cargar guardianes
  useEffect(() => {
    (async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) throw new Error('No auth token');
        const res = await fetch('https://bw48008o8ooo848csscss8o0.hogarnuestrasenoradelrosariosantacruz.org/api/Guardian', {
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
  const onSubmit: SubmitHandler<GuardianFormInputs> = data => {    saveGuardian(data as Guardian, {
      onSuccess: (res: unknown) => {
        const response = res as { data?: { id_Guardian?: number } };
        const id = response.data?.id_Guardian;
        if (id) {
          setGuardianId(id);
          setIsGuardianAdded(true);
          showToast('Guardián añadido exitosamente', 'success');
          setTimeout(() => setIsGuardianAdded(true), 3000);
        }
      },      onError: (error: unknown) => {
        console.error('Error completo en AddGuardianForm:', error);
        
        let errorMessage = 'Error al guardar el guardián.';
        
        // Verificar si es un error de axios
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: unknown; status?: number } };
          console.log('Axios error response:', axiosError.response);
          
          // Intentar extraer mensaje específico del backend
          if (axiosError.response?.data) {
            const responseData = axiosError.response.data as Record<string, unknown>;
            if (typeof responseData === 'object' && responseData.message) {
              errorMessage = String(responseData.message);
            }
            // Si data es un objeto con error
            else if (typeof responseData === 'object' && responseData.error) {
              errorMessage = String(responseData.error);
            }
            // Si data es un string
            else if (typeof responseData === 'string') {
              errorMessage = responseData;
            }
            // Si es un error 500, mostrar mensaje específico
            else if (axiosError.response.status === 500) {
              errorMessage = 'Error interno del servidor. Por favor, intente nuevamente.';
            }
            // Si es un error 400, datos no válidos
            else if (axiosError.response.status === 400) {
              errorMessage = 'Los datos del guardián no son válidos.';
            }
            // Si es un error 409, conflicto (guardián ya existe)
            else if (axiosError.response.status === 409) {
              errorMessage = 'El guardián ya existe en el sistema.';
            }
          }
        }
        // Si no hay response, verificar si hay mensaje en el error principal
        else if (error && typeof error === 'object' && 'message' in error) {
          errorMessage = String((error as Error).message);
        }
        
        showToast(errorMessage, 'error');
      },
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
                  <label className="block mb-2 text-lg">Cédula del encargado</label>
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
              {...register('phone_GD', { required: 'El teléfono es obligatorio',
                maxLength: { value: 8, message: 'Debe contener 8 caracteres' },
    minLength: { value: 8, message: 'Debe contener 8 caracteres' },
    pattern: { value: /^\d+$/, message: 'Debe contener solo números' }
              })}
              className={`w-full p-3 rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'
              }`}
            />
            {errors.phone_GD && <p className="text-red-500">{errors.phone_GD.message}</p>}
          </div>

          <button
            type="submit"
            className="col-span-2 px-7 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mx-auto block"
            disabled={isVerifying || cedulaCheck?.exists}
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
