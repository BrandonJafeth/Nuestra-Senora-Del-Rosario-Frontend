import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../../hooks/useRoom'; // Hook para cargar habitaciones
import { useDependencyLevel } from '../../hooks/useDependencyLevel'; // Hook para cargar niveles de dependencia
import { useToast } from '../../hooks/useToast'; // Hook para mostrar notificaciones
import { useCreateResident } from '../../hooks/useCreateResident '; // Hook para crear residentes
import { ResidentPostType } from '../../types/ResidentsType'; // Importando el tipo ResidentPostType
import AddGuardianForm from './AddGuardianForm'; // Importamos AddGuardianForm para crear el guardián

function NewResidentForm() {
  const { data: rooms } = useRoom();
  const { data: dependencyLevels } = useDependencyLevel();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { mutate: createResident, isLoading } = useCreateResident();

  // Estado para manejar los datos del formulario de residente
  const [residentData, setResidentData] = useState<ResidentPostType>({
    name_AP: '',
    lastname1_AP: '',
    lastname2_AP: '',
    cedula_AP: '',
    sexo: 'Masculino',
    fechaNacimiento: '',
    id_Guardian: 0,
    id_Room: 0,
    entryDate: '',
    id_DependencyLevel: 0,
    location: '',
  });

  const [isGuardianAdded, setIsGuardianAdded] = useState(false); // Verificar si se añadió guardián
  const [guardianId, setGuardianId] = useState<number | null>(null); // ID del guardián

  // Manejo del envío del formulario
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que el guardián ha sido añadido
    if (guardianId === null) {
      showToast('Por favor añade un guardián antes de continuar.', 'error');
      return;
    }

    const residentPayload = { ...residentData, id_Guardian: guardianId };

    createResident(residentPayload, {
      onSuccess: () => {
        showToast('Residente registrado exitosamente', 'success');
        navigate('/dashboard/residentes');
      },
      onError: (error) => {
        console.error('Error al crear el residente:', error);
        showToast('Error al crear el residente. Revisa los datos ingresados', 'error');
      },
    });
  };

  return (
    <div className="w-full max-w-[1169px] mx-auto p-6 bg-white rounded-[20px] shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-8">Añadir Información del Residente</h2>

      {/* Mostrar el formulario de AddGuardianForm si no se ha añadido un guardián */}
      {!isGuardianAdded ? (
        <AddGuardianForm 
          setIsGuardianAdded={setIsGuardianAdded} 
          setGuardianId={setGuardianId} 
        />
      ) : (
        <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-6">
          {/* Campos del residente */}
          <div>
            <label className="block mb-2 text-lg">Nombre</label>
            <input
              type="text"
              value={residentData.name_AP}
              onChange={(e) => setResidentData({ ...residentData, name_AP: e.target.value })}
              className="w-full p-3 rounded-md bg-gray-200"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Primer Apellido</label>
            <input
              type="text"
              value={residentData.lastname1_AP}
              onChange={(e) => setResidentData({ ...residentData, lastname1_AP: e.target.value })}
              className="w-full p-3 rounded-md bg-gray-200"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Segundo Apellido</label>
            <input
              type="text"
              value={residentData.lastname2_AP}
              onChange={(e) => setResidentData({ ...residentData, lastname2_AP: e.target.value })}
              className="w-full p-3 rounded-md bg-gray-200"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Cédula</label>
            <input
              type="text"
              value={residentData.cedula_AP}
              onChange={(e) => setResidentData({ ...residentData, cedula_AP: e.target.value })}
              className="w-full p-3 rounded-md bg-gray-200"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Sexo</label>
            <select
              value={residentData.sexo}
              onChange={(e) => setResidentData({ ...residentData, sexo: e.target.value })}
              className="w-full p-3 rounded-md bg-gray-200"
              required
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-lg">Fecha de Nacimiento</label>
            <input
              type="date"
              value={residentData.fechaNacimiento}
              onChange={(e) => setResidentData({ ...residentData, fechaNacimiento: e.target.value })}
              className="w-full p-3 rounded-md bg-gray-200"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Habitación</label>
            <select
              value={residentData.id_Room}
              onChange={(e) => setResidentData({ ...residentData, id_Room: parseInt(e.target.value) })}
              className="w-full p-3 rounded-md bg-gray-200"
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
              className="w-full p-3 rounded-md bg-gray-200"
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
              className="w-full p-3 rounded-md bg-gray-200"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-lg">Ubicación</label>
            <input
              type="text"
              value={residentData.location}
              onChange={(e) => setResidentData({ ...residentData, location: e.target.value })}
              className="w-full p-3 rounded-md bg-gray-200"
              required
            />
          </div>

          <div className="flex justify-center space-x-4 col-span-2 mt-8">
            {/* Botón de Enviar */}
            <button
              type="submit"
              className="px-7 py-4 bg-blue-500 text-white text-lg rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
              disabled={isLoading} // Desactivar mientras se envía la información
            >
              {isLoading ? 'Guardando...' : 'Registrar Residente'}
            </button>

            {/* Botón de Volver */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-7 py-4 bg-red-500 text-white text-lg rounded-lg shadow-lg hover:bg-red-600 transition duration-200"
            >
              Volver
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default NewResidentForm;
