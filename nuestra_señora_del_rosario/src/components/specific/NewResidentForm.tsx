import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../../hooks/useRoom';
import { useDependencyLevel } from '../../hooks/useDependencyLevel';
import { useToast } from '../../hooks/useToast';
import { ResidentPostType } from '../../types/ResidentsType';
import AddGuardianForm from './AddGuardianForm';
import { useThemeDark } from '../../hooks/useThemeDark';
import Toast from '../common/Toast';
import { FaArrowLeft } from 'react-icons/fa';
import LoadingSpinner from '../microcomponents/LoadingSpinner';
import { useCreateResident } from '../../hooks/useCreateResident ';
import { useFetchResidentInfo } from '../../hooks/useFetchResidentInfo';


function NewResidentForm() {
  const { data: rooms } = useRoom();
  const { data: dependencyLevels } = useDependencyLevel();
  const { showToast, message, type } = useToast();
  const { isDarkMode } = useThemeDark();
  const navigate = useNavigate();
  const { mutate: createResident, isLoading } = useCreateResident();
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

  const { data: residentInfo } = useFetchResidentInfo(residentData.cedula_RD);
  
  const capitalize = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  const [isGuardianAdded, setIsGuardianAdded] = useState(false);
  const [guardianId, setGuardianId] = useState<number | null>(null);

  const navigateBack = () => window.history.back();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

   if (!residentData.name_RD.trim()) {
  showToast('El nombre del residente es requerido', 'error');
  return;
}
if (residentData.name_RD.length < 3) {
  showToast('El nombre debe tener al menos 3 caracteres', 'error');
  return;
}
if (residentData.name_RD.length > 25) {
  showToast('El nombre no puede exceder 25 caracteres', 'error');
  return;
}
if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s']+$/.test(residentData.name_RD)) {
  showToast('El nombre solo puede contener letras, espacios y apóstrofes', 'error');
  return;
}

// Validación del primer apellido
if (!residentData.lastname1_RD.trim()) {
  showToast('El primer apellido es requerido', 'error');
  return;
}
if (residentData.lastname1_RD.length < 3) {
  showToast('El primer apellido debe tener al menos 3 caracteres', 'error');
  return;
}
if (residentData.lastname1_RD.length > 25) {
  showToast('El primer apellido no puede exceder 25 caracteres', 'error');
  return;
}
if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s']+$/.test(residentData.lastname1_RD)) {
  showToast('El primer apellido solo puede contener letras, espacios y apóstrofes', 'error');
  return;
}

// Validación del segundo apellido
if (!residentData.lastname2_RD.trim()) {
  showToast('El segundo apellido es requerido', 'error');
  return;
}
if (residentData.lastname2_RD.length < 3) {
  showToast('El segundo apellido debe tener al menos 3 caracteres', 'error');
  return;
}
if (residentData.lastname2_RD.length > 25) {
  showToast('El segundo apellido no puede exceder 25 caracteres', 'error');
  return;
}
if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s']+$/.test(residentData.lastname2_RD)) {
  showToast('El segundo apellido solo puede contener letras, espacios y apóstrofes', 'error');
  return;
}
    // Cédula (9 dígitos)
    if (!/^\d{9}$/.test(residentData.cedula_RD)) {
      showToast('La cédula debe ser un número de 9 dígitos', 'error');
      return;
    }
    // Guardián
    if (guardianId === null) {
      showToast('Por favor añade un guardián antes de continuar.', 'error');
      return;
    }
    // Fecha nacimiento y entrada
    if (!residentData.fechaNacimiento) {
      showToast('La fecha de nacimiento es requerida', 'error');
      return;
    } 
    if (new Date(residentData.fechaNacimiento) > new Date()) {
      showToast('La fecha de nacimiento no puede ser futura', 'error');
      return;
    }
    // Edad mínima 65
    const birth = new Date(residentData.fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    if (age < 65) {
      showToast('El residente debe ser mayor de 65 años.', 'error');
      return;
    }
    if (!residentData.entryDate) {
      showToast('La fecha de entrada es requerida', 'error');
      return;
    }
    // Selecciones
    if (residentData.id_Room === 0) {
      showToast('Seleccione una habitación', 'error');
      return;
    }
    if (residentData.id_DependencyLevel === 0) {
      showToast('Seleccione un grado de dependencia', 'error');
      return;
    }
    
    // Domicilio
    if (!residentData.location_RD.trim()) {
      showToast('El domicilio es requerido', 'error');
      return;
    }
    if (residentData.location_RD.length < 5) {
      showToast('El domicilio debe tener al menos 5 caracteres', 'error');
      return;
    }
    if (residentData.location_RD.length > 100) {
      showToast('El domicilio no puede exceder 100 caracteres', 'error');
      return;
    }

    // Enviar
    createResident({ ...residentData, id_Guardian: guardianId }, {
      onSuccess: () => {
        showToast('Residente registrado exitosamente', 'success');
        setTimeout(() => navigate('/dashboard/residentes'), 2000);
      },
      onError: (error: any) => {
        console.error('Error completo:', error);
        const data = error.response?.data;
        let msgs: string[] = [];
        if (data) {
          if (typeof data === 'string') msgs.push(data);
          else if (data.error) msgs.push(data.error);
          else if (data.message) msgs.push(data.message);
          else if (data.errors) Object.values(data.errors).flat().forEach((m: any) => msgs.push(m));
          else if (data.title) msgs.push(data.title);
        } else if (error.message) msgs.push(error.message);
        if (!msgs.length) msgs.push('Error al registrar el residente.');
        showToast(msgs.join('\n'), 'error');
      }
    });
  };

  useEffect(() => {
  const results = residentInfo?.results;
  if (results && results.length > 0) {
    const person = results[0];
    // Nombres: firstname + firstname2 (si existe)
    const nombres = [person.firstname]
      .filter(Boolean)
      .map(capitalize)
      .join(' ');
    // Actualiza el estado
    setResidentData(rd => ({
      ...rd,
      name_RD: nombres,
      lastname1_RD: capitalize(person.lastname1),
      lastname2_RD: capitalize(person.lastname2),
    }));
  }
}, [residentInfo]);


  return (
    <div className={`w-full max-w-[1169px] mx-auto p-6 rounded-[20px] shadow-2xl ${
      isDarkMode ? 'bg-[#0D313F] text-white' : 'bg-white text-gray-800'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={navigateBack}
          className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          <FaArrowLeft size={20} />
          <span className="text-lg font-semibold">Regresar</span>
        </button>
        <h1 className="text-3xl font-bold mr-[425px]">Añadir información</h1>
      </div>
      {!isGuardianAdded ? (
        <AddGuardianForm setIsGuardianAdded={setIsGuardianAdded} setGuardianId={setGuardianId} />
      ) : (
        <form onSubmit={handleFormSubmit} noValidate className="grid grid-cols-2 gap-6">
          {/* Campos del residente */}
          <div>
            <label className="block mb-2 text-lg">Cédula Residente</label>
            <input
              type="text"
              value={residentData.cedula_RD}
              onChange={e => setResidentData({ ...residentData, cedula_RD: e.target.value })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            />
          </div>
          <div>
            <label className="block mb-2 text-lg">Nombre residente</label>
            <input
              type="text"
              value={residentData.name_RD}
              onChange={e => setResidentData({ ...residentData, name_RD: e.target.value })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            />
          </div>
          <div>
            <label className="block mb-2 text-lg">Primer apellido residente</label>
            <input
              type="text"
              value={residentData.lastname1_RD}
              onChange={e => setResidentData({ ...residentData, lastname1_RD: e.target.value })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            />
          </div>
          <div>
            <label className="block mb-2 text-lg">Segundo apellido residente</label>
            <input
              type="text"
              value={residentData.lastname2_RD}
              onChange={e => setResidentData({ ...residentData, lastname2_RD: e.target.value })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            />
          </div>
          <div>
            <label className="block mb-2 text-lg">Sexo Residente</label>
            <select
              value={residentData.sexo}
              onChange={e => setResidentData({ ...residentData, sexo: e.target.value })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-lg">Fecha de nacimiento residente</label>
            <input
              type="date"
              value={residentData.fechaNacimiento}
              onChange={e => setResidentData({ ...residentData, fechaNacimiento: e.target.value })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            />
          </div>
          <div>
            <label className="block mb-2 text-lg">Habitación</label>
            <select
              value={residentData.id_Room}
              onChange={e => setResidentData({ ...residentData, id_Room: parseInt(e.target.value) })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            >
              <option value={0}>Seleccionar habitación</option>
              {rooms?.map(room => (
                <option key={room.id_Room} value={room.id_Room}>{room.roomNumber}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-lg">Grado de dependencia</label>
            <select
              value={residentData.id_DependencyLevel}
              onChange={e => setResidentData({ ...residentData, id_DependencyLevel: parseInt(e.target.value) })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            >
              <option value={0}>Seleccionar dependencia</option>
              {dependencyLevels?.map(level => (
                <option key={level.id_DependencyLevel} value={level.id_DependencyLevel}>{level.levelName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-lg">Fecha de entrada</label>
            <input
              type="date"
              value={residentData.entryDate}
              onChange={e => setResidentData({ ...residentData, entryDate: e.target.value })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-2 text-lg">Domicilio del residente</label>
            <input
              type="text"
              value={residentData.location_RD}
              onChange={e => setResidentData({ ...residentData, location_RD: e.target.value })}
              className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            />
          </div>
          <div className="flex justify-center space-x-4 col-span-2 mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-7 py-4 rounded-lg shadow-lg transition duration-200 ${isLoading ? 'bg-gray-400' : isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              {isLoading ? <LoadingSpinner/> : 'Registrar Residente'}
            </button>
            <button
              type="button"
              onClick={navigateBack}
              className="px-7 py-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
            >
              Volver
            </button>
          </div>
        </form>
      )}
      <Toast message={message} type={type}/>
    </div>
  );
}

export default NewResidentForm;
