import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../../hooks/useRoom'; // Hook para cargar habitaciones
import { useDependencyLevel } from '../../hooks/useDependencyLevel'; // Hook para cargar niveles de dependencia
import { useToast } from '../../hooks/useToast'; // Hook para mostrar notificaciones
import { ResidentPostType } from '../../types/ResidentsType'; // Importando el tipo ResidentPostType
import AddGuardianForm from './AddGuardianForm'; // Importamos AddGuardianForm para crear el guardián
import { useThemeDark } from '../../hooks/useThemeDark'; // Hook para modo oscuro
import { useCreateResident } from '../../hooks/useCreateResident ';
import Toast from '../common/Toast';
import { FaArrowLeft } from 'react-icons/fa';
import LoadingSpinner from '../microcomponents/LoadingSpinner';

function NewResidentForm() {
  const { data: rooms } = useRoom();
  const { data: dependencyLevels } = useDependencyLevel();
  const { showToast} = useToast();
const [toastMessage, setToastMessage] = useState<string | null>(null);
const [toastType, setToastType] = useState<'success' | 'error' | null>(null);
  const { isDarkMode } = useThemeDark(); // Detectar el modo oscuro
  const navigate = useNavigate();
  const { mutate: createResident, isLoading } = useCreateResident();

  // Estado para manejar los datos del formulario de residente
  const [residentData, setResidentData] = useState<ResidentPostType>({
    name_RD: '',
    lastname1_RD: '',
    lastname2_RD: '',
    cedula_RD: '',
    sexo: 'Masculino',
    fechaNacimiento: '',
    id_Guardian: 0,
    id_Room: 0,
    entryDate: '',
    id_DependencyLevel: 0,
    location_RD: '',
  });

  const [isGuardianAdded, setIsGuardianAdded] = useState(false); // Verificar si se añadió guardián
  const [guardianId, setGuardianId] = useState<number | null>(null); // ID del guardián

  // Este efecto limpia el toast 3 segundos después de mostrarlo
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
        setToastType(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toastMessage]);
  
  // Manejo del envío del formulario
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleFormSubmit ejecutado");
  
    // Verificar que se haya asignado un guardián
    if (guardianId === null) {
      showToast('Por favor añade un guardián antes de continuar.', 'error');
      return;
    }
  
    if (
      !residentData.name_RD ||
      !residentData.lastname1_RD ||
      !residentData.lastname2_RD ||
      !residentData.cedula_RD ||
      !residentData.fechaNacimiento ||
      !residentData.entryDate ||
      !residentData.location_RD ||
      residentData.id_Room === 0 ||
      residentData.id_DependencyLevel === 0
    ) {
      setToastMessage('Por favor completa todos los campos requeridos.');
      setToastType('error');
      return;
    }
  
    // Validar que el residente tenga 65 años o más
    const birthDate = new Date(residentData.fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 65) {
      setToastMessage('El residente debe ser mayor de 65 años.');
      setToastType('error');
      return;
    }
  
    // Preparar el payload para enviar al backend
    const residentPayload = { ...residentData, id_Guardian: guardianId };
  
createResident(residentPayload, {
  onSuccess: () => {
    setToastMessage('Residente registrado exitosamente');
    setToastType('success');
    setTimeout(() => navigate('/dashboard/residentes'), 2000);
  },
  onError: (error: any) => {
    // Log para depuración
    console.log('Error completo:', error);
    console.log('Response data:', error.response?.data);
    
    let errorMessages: string[] = [];
    
    if (error.response?.data) {
      // Caso 1: Error con mensaje simple
      if (typeof error.response.data === 'string') {
        errorMessages.push(error.response.data);
      } 
      // Caso 2: Error con propiedad 'error'
      else if (error.response.data.error) {
        errorMessages.push(error.response.data.error);
      } 
      // Caso 3: Error con propiedad 'message'
      else if (error.response.data.message) {
        errorMessages.push(error.response.data.message);
      }
      // Caso 4: Errores de validación con estructura anidada
      else if (error.response.data.errors) {
        // Recorre cada categoría de error
        Object.keys(error.response.data.errors).forEach(key => {
          const messages = error.response.data.errors[key];
          if (Array.isArray(messages)) {
            // Si son arrays, añade cada mensaje sin el prefijo
            messages.forEach(msg => errorMessages.push(msg));
          } else if (typeof messages === 'string') {
            // Si es string directo, sin prefijo
            errorMessages.push(messages);
          }
        });
      }
      // Caso 5: Si hay un título general
      else if (error.response.data.title) {
        errorMessages.push(error.response.data.title);
      }
    } 
    // Fallback a mensaje genérico de error
    else if (error.message) {
      errorMessages.push(error.message);
    }
    
    // Si no se encontró ningún mensaje específico
    if (errorMessages.length === 0) {
      errorMessages.push('Error al registrar el residente.');
    }
    
    // Combina todos los mensajes en uno solo con saltos de línea
    const combinedMessage = errorMessages.join('\n');
    setToastMessage(combinedMessage);
    setToastType('error');
  },
});
  };
  
  

  const navigateBack = () => {  
 window.history.back(); // Navegar hacia atrás
  }

  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'}`}>
       <div className="flex justify-between items-center mb-6">
        {/* Botón de regresar */}
        <button
          onClick={navigateBack}
          className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          <FaArrowLeft size={20} />
          <span className="text-lg font-semibold">Regresar</span>
        </button>

        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mr-64">
  Añadir Información
</h1>

      </div>
      {!isGuardianAdded ? (
        <AddGuardianForm 
          setIsGuardianAdded={setIsGuardianAdded} 
          setGuardianId={setGuardianId} 
        />
      ) : (
        <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-6">
          {/* Campos del residente */}
          <div>
            <label className="block mb-2 text-lg">Nombre Residente</label>
            <input
              type="text"
              value={residentData.name_RD}
              onChange={(e) => setResidentData({ ...residentData, name_RD: e.target.value })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Primer Apellido Residente</label>
            <input
              type="text"
              value={residentData.lastname1_RD}
              onChange={(e) => setResidentData({ ...residentData, lastname1_RD: e.target.value })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Segundo Apellido Residente</label>
            <input
              type="text"
              value={residentData.lastname2_RD}
              onChange={(e) => setResidentData({ ...residentData, lastname2_RD: e.target.value })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Cédula Residente</label>
            <input
              type="text"
              value={residentData.cedula_RD}
              onChange={(e) => setResidentData({ ...residentData, cedula_RD: e.target.value })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Sexo Residente</label>
            <select
              value={residentData.sexo}
              onChange={(e) => setResidentData({ ...residentData, sexo: e.target.value })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
              required
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-lg">Fecha de Nacimiento Residente</label>
            <input
              type="date"
              value={residentData.fechaNacimiento}
              onChange={(e) => setResidentData({ ...residentData, fechaNacimiento: e.target.value })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Habitación</label>
            <select
              value={residentData.id_Room}
              onChange={(e) => setResidentData({ ...residentData, id_Room: parseInt(e.target.value) })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
              required
            >
              <option value="">Seleccionar habitación</option>
              {rooms && rooms.map((room) => (
                <option key={room.id_Room} value={room.id_Room}>
                  {room.roomNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-lg">Grado de Dependencia</label>
            <select
              value={residentData.id_DependencyLevel}
              onChange={(e) => setResidentData({ ...residentData, id_DependencyLevel: parseInt(e.target.value) })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
              required
            >
              <option value="">Seleccionar grado de dependencia</option>
              {dependencyLevels && dependencyLevels.map((level) => (
                <option key={level.id_DependencyLevel} value={level.id_DependencyLevel}>
                  {level.levelName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-lg">Fecha de Entrada</label>
            <input
              type="date"
              value={residentData.entryDate}
              onChange={(e) => setResidentData({ ...residentData, entryDate: e.target.value })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-lg">Domicilio del Residente</label>
            <input
              type="text"
              value={residentData.location_RD}
              onChange={(e) => setResidentData({ ...residentData, location_RD: e.target.value })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
              required
            />
          </div>

          <div className="flex justify-center space-x-4 col-span-2 mt-8">
            {/* Botón de Enviar */}
            <button
              type="submit"
              className={`px-7 py-4 rounded-lg shadow-lg transition duration-200 ${isLoading ? 'bg-gray-400' : isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner/> : 'Registrar Residente'}
            </button>

            {/* Botón de Volver */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-7 py-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
            >
              Volver
            </button>
          </div>
        </form>
      )}
      <Toast message={toastMessage} type={toastType || 'error'} />
    </div>
  );
}

export default NewResidentForm;
